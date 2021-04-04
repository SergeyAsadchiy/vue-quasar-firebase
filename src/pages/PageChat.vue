<template>
  <q-page class="flex column container">
    <q-banner v-if="!otherUserDetails.online" class="text-center text-grey-8 bg-grey-4">
      User {{otherUserDetails.name}} is off-line
    </q-banner>
    <div class="q-pa-md column col">
      <q-scroll-area ref="chatMessages" :style="'height: calc(100vh - ' + bannerHeight + 'px - 130px)'" class="bg-grey-1 q-px-md">
        <q-chat-message
            class="q-pr-lg"
            v-for="(message, index) in messages"
            :name="message.from === 'me' ? 'me: ' + userDetails.name : otherUserDetails.name"
            :text="[message.text]"
            :key="message.text + '_' + index"
            :sent="message.from === 'me'"
            :bg-color="message.from === 'me' ? 'grey-4' : 'blue-3'"
        />
      </q-scroll-area>
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
              @keyup.enter.prevent="sendMessage"
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
    },
    bannerHeight () {
      return this.otherUserDetails?.online ? 0 : 54
    }

  },
  methods: {
    ...mapActions(['bindChat', 'unbindChat', 'sendMessageDB']),

    sendMessage () {
      this.sendMessageDB({
        message: {
          text: this.newMessage,
          from: 'me'
        },
        otherUserID: this.otherUserID
      })
      this.newMessage = ''
    },
    scrollChatToBottom () {
      this.$refs.chatMessages.setScrollPosition(999999999, 500)
    }
  },
  watch: {
    messages () {
      this.scrollChatToBottom()
    },
    bannerHeight () {
      this.scrollChatToBottom()
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
