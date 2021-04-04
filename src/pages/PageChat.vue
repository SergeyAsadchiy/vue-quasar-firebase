<template>
  <q-page class="flex column container">
    <q-banner class="text-center text-grey-8 bg-grey-4">
      User is off-line
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
          v-for="(message, index) in messages"
          :name="message.from"
          :text="[message.text]"
          :key="message.text + '_' + index"
          :sent="message.from === 'me'"
          :bg-color="message.from === 'me' ? 'grey-4' : 'blue-3'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="chat-footer">
          <q-input
              bg-color="white"
              dense
              label="Message"
              outlined
              rounded
              v-model="newMessage"
          >
            <template v-slot:after>
              <q-btn dense flat icon="send" round color="white"/>
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>  </q-page>
</template>

<script>
export default {
  name: 'PageChat',
  data () {
    return {
      newMessage: '',
      messages: [
        {
          text: 'hey, how are you?',
          from: 'me'
        },
        {
          text: 'Good thanks, how are you?',
          from: 'them'
        },
        {
          text: 'Pretty, good!',
          from: 'me'
        }
      ]
    }
  },
  methods: {
    sendMessage () {
      this.messages.push({
        text: this.newMessage,
        from: 'me'
      })
    }
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
