<template>
  <q-page class="flex" v-if="user">
    <q-card class="container">
      <q-form @submit="onSubmit" class="q-gutter-y-sm q-pa-lg">
        <q-input class="" dense label="name" outlined v-model="user.name"/>
        <q-input class="" dense disable label="email" outlined type="email" v-model="user.email"/>
        <div class="column q-my-xl">
          Upload avatar image:
          <progress :value="progress" id="uploader" max="100">{{progress}}%</progress>
          <q-input outlined @change="addFileFromInput" id="fileButton" type="file">
            <template v-if="file" v-slot:append>
              <q-icon name="cancel" @click.prevent="onFileRemoved" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        or Upload avatar image via QUploader
        <q-uploader
            :factory="addFile"
            auto-upload
            @removed="onFileRemoved"
            @rejected="onFileRejected"
            max-file-size="30000000"
            max-files="1"
            class="full-width"
            label="Upload file"
            text-color="white"
        />
        <q-btn type="submit">submit</q-btn>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'PageUserSettings',
  data () {
    return {
      user: null,
      file: null,
      progress: 0
    }
  },
  methods: {
    ...mapActions(['uploadFileToStorage', 'updateUserInDB', 'getUserByID', 'deleteFileFromStorage']),
    ...mapMutations(['SET_USER_DETAILS']),

    addFile (files) {
      this.file = files[0]
    },
    addFileFromInput (e) {
      this.file = e.target.files[0]
    },
    async onSubmit () {
      const updateUserPayload = {
        userID: this.user?.userID,
        updates: {
          name: this.user?.name
        }
      }

      // uploadFileToStorage
      if (this.file) {
        const path = `users/${this.userDetails.userID}/avatarImages/${this.file.name}`
        const oldPath = `users/${this.userDetails.userID}/avatarImages/${this.userDetails?.avatarImage?.fileName}`
        const avatarImage = await this.uploadFileToStorage({
          file: this.file,
          path: path,
          percentShowCallBack: (progress) => {
            this.progress = progress
          }
        })
        if (this.userDetails?.avatarImage?.fileName) {
          await this.deleteFileFromStorage({ path: oldPath })
        }
        updateUserPayload.updates.avatarImage = avatarImage
      }

      // saveSettingsToDB
      await this.updateUserInDB(updateUserPayload)

      // get current user from DB
      let respUser = await this.getUserByID(this.user.userID)
      respUser = respUser.data()

      // update userDetails in store
      if (respUser) {
        this.SET_USER_DETAILS({
          name: respUser.name,
          email: respUser.email,
          userID: this.user.userID,
          avatarImage: respUser.avatarImage ?? null
        })
      }
    },
    onFileRemoved () {
      this.progress = 0
      this.file = null
    },
    onFileRejected () {
      this.$q.notify({ message: 'upload file was rejected', color: 'red' })
    }
  },
  computed: {
    ...mapState(['userDetails'])
  },
  mounted () {
    this.user = JSON.parse(JSON.stringify(this.userDetails))
  }
}
</script>
<style>
  #uploader {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    margin-bottom: 10px;
  }
</style>
