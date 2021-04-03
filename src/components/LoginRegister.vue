<template>
  <q-form @submit="submitForm">
    <q-input v-if="tab === 'register'" class="q-mb-md" v-model="formData.name" outlined label="Name"/>
    <q-input class="q-mb-md" v-model="formData.email" outlined label="E-mail"/>
    <q-input class="q-mb-md" v-model="formData.password" outlined label="Password"/>
    <div class="row">
      <q-space/>
      <q-btn color="primary" type="submit" :label="tab"/>
    </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginRegister',
  props: {
    tab: null
  },
  data () {
    return {
      formData: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(['registerUser', 'loginUser']),
    submitForm () {
      if (this.tab === 'login') {
        this.loginUser(this.formData)
      } else {
        this.registerUser(this.formData)
      }
    }
  }
}
</script>

<style scoped>

</style>
