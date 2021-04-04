<template>
  <q-page class="flex column container">
    <q-banner v-if="!otherUserDetails.online" class="text-center text-grey-8 bg-grey-4">
      User {{otherUserDetails.name}} is off-line
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
          v-for="(message, index) in messages"
          :name="message.from === 'me' ? 'me: ' + userDetails.name : otherUserDetails.name"
          :text="[message.text]"
          :key="message.text + '_' + index"
          :sent="message.from === 'me'"
          :bg-color="message.from === 'me' ? 'grey-4' : 'blue-3'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <div class="chat-footer">
          <q-input
              bg-color="white"
              dense
              label="Message"
              outlined
              rounded
              v-model="newMessage"
          >
            <template v-slot:after>
              <q-btn @click="sendMessage" dense flat icon="send" type="submit" round color="white"/>
            </template>
          </q-input>
        </div>
      </q-toolbar>
    </q-footer>  </q-page>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixinOtherUserDetails.js'

export default {
  name: 'PageChat',
  mixins: [mixinOtherUserDetails],
  data () {
    return {
      newMessage: '',
      otherUserID: ''
    }
  },
  computed: {
    ...mapGetters(['users', 'chat']),
    ...mapState(['userDetails']),

    messages () {
      return this.chat
    }
  },
  methods: {
    ...mapActions(['bindChat', 'unbindChat', 'addMessage']),

    sendMessage () {
      /* this.messages.push({
        text: this.newMessage,
        from: 'me'
      }) */
    }
  },
  mounted () {
    this.otherUserID = this.$route.params?.otherUserID
    this.bindChat(this.otherUserID)
  },
  beforeDestroy () {
    this.unbindChat()
  }
}
</script>
<style lang="scss">
  .chat-footer {
    width: 40%;
    min-width: 400px;
    margin: auto;
  }
</style>
