export default {
  computed: {
    otherUserDetails () {
      return this.$store.state?.users?.find(e => e.id === this.$route.params?.otherUserID) ?? { name: '', online: false }
    }
  }
}
