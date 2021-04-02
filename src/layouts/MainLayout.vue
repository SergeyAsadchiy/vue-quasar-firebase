<template>
  <q-layout view="hHh lpR fFf">
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

        <q-toolbar-title class="absolute-center">
          {{title}}
        </q-toolbar-title>

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

    <q-page-container class="container" >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import ProjectLink from 'components/ProjectLink.vue'

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
    title: 'ChatPage',
    caption: 'chat page',
    icon: 'chat',
    link: '/chat'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink, ProjectLink },
  data () {
    return {
      leftDrawerOpen: true,
      essentialLinks: essentialLinksData,
      projectLinks: projectLinksData
    }
  },
  computed: {
    title () {
      const currentPath = this.$route.fullPath
      let result
      switch (currentPath) {
        case '/': result = 'User Page'
          break
        case '/chat': result = 'Chat Page'
          break
        case '/auth': result = 'Auth Page'
          break
      }
      return result
    }
  },
  mounted () {
    this.leftDrawerOpen = false
  }
}
</script>

<style>
  .container {
    max-width: 900px;
  }
</style>
