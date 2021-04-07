<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
            dense
            flat
            icon="arrow_back"
            label="Back"
            v-go-back.single
            v-if="$route.fullPath.includes('/chat')"
        />
        <q-toolbar-title class="absolute-center">
          {{title}}
        </q-toolbar-title>
        <q-btn
            v-if="!userDetails.userID"
            to="/auth"
            class="absolute-right q-mr-sm"
            dense
            flat
            no-caps
            icon="account_circle"
            label="Login"
        />
        <q-btn
            v-else
            @click="logoutUser"
            class="absolute-right q-mr-sm"
            dense
            flat
            no-caps
        >
          <q-avatar>
            <q-img
                v-if="avatarURL"
                style="height: 40px"
                :src="avatarURL">
            </q-img>
            <q-icon v-else name="account_circle"/>
          </q-avatar>
          <div class="q-ml-sm">
            <div>Logout</div>
            <div>{{userDetails.name}}</div>
          </div>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="(link, index) in essentialLinks"
          :key="link.title + '_' + index"
          v-bind="link"
        />
      </q-list>
      <q-separator class="q-mt-xl"/>
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Project Links
        </q-item-label>
        <ProjectLink
          v-for="(link, index) in projectLinks"
          :key="link.title + '_' + index"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import ProjectLink from 'components/ProjectLink.vue'
import { mapActions, mapState } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixinOtherUserDetails.js'

const essentialLinksData = [
  {
    title: 'Github',
    caption: 'github.com',
    icon: 'code',
    link: 'https://github.com'
  },
  {
    title: 'Google',
    caption: 'google.com',
    icon: 'record_voice_over',
    link: 'https://google.com'
  },
  {
    title: 'Facebook',
    caption: 'facebook.com',
    icon: 'public',
    link: 'https://facebook.com'
  }
]

const projectLinksData = [
  {
    title: 'UserPage',
    caption: 'user page',
    icon: 'person',
    link: '/'
  },
  {
    title: 'AuthPage',
    caption: 'auth page',
    icon: 'login',
    link: '/auth'
  },
  {
    title: 'User Settings Page',
    caption: 'user settings page',
    icon: 'settings',
    link: '/user-settings'
  }
]

export default {
  name: 'MainLayout',
  mixins: [mixinOtherUserDetails],
  components: { EssentialLink, ProjectLink },
  data () {
    return {
      leftDrawerOpen: true,
      essentialLinks: essentialLinksData,
      projectLinks: projectLinksData
    }
  },
  methods: {
    ...mapActions(['logoutUser'])
  },
  computed: {
    ...mapState(['userDetails']),

    title () {
      const currentPath = this.$route.fullPath
      let result
      if (currentPath === '/') result = 'Users Page'
      else if (currentPath.includes('/chat')) result = this.otherUserDetails.name + ' Chat'
      else if (currentPath.includes('/auth')) result = 'Auth Page'
      return result
    },
    avatarURL () {
      return this.userDetails?.avatarImage?.downloadableURL
    }
  },
  mounted () {
    this.leftDrawerOpen = false
  }
}
</script>

<style lang="scss">
  .q-toolbar{
    .q-btn{
      line-height: 1.2;
    }
  }
  .container {
    width: 40%;
    min-width: 400px;
    height: 90vh;
    margin: auto;
  }
</style>
