<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { firebaseAuth } from 'boot/firebase'

export default {
  name: 'App',
  methods: {
    ...mapActions(['getUserByID', 'updateUserInDB', 'bindUsers', 'unbindUsers']),
    ...mapMutations(['SET_USER_DETAILS']),

    handleAuthStateChanged () {
      firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          // User is logged in.
          const userID = firebaseAuth.currentUser.uid
          this.getUserByID(userID)
            .then(resp => {
              const userDetails = resp.data()
              this.SET_USER_DETAILS({
                name: userDetails?.name,
                email: userDetails?.email,
                userID: userID,
                avatarUrl: userDetails?.avatarImage?.downloadableURL ?? null
              })
              this.updateUserInDB({ userID: userID, updates: { online: true } })
              this.bindUsers()
              this.$router.push('/')
            })
        } else {
          // User is logged out.
          this.updateUserInDB({
            userID: this.userDetails?.userID,
            updates: { online: false }
          })
          this.SET_USER_DETAILS({})
          this.unbindUsers()
          this.$router.push('/auth')
        }
      })
    }
  },
  computed: {
    ...mapState(['userDetails'])
  },
  mounted () {
    this.handleAuthStateChanged()
  }
}
</script>
