import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseAuth, firebaseDB } from 'boot/firebase'
import { Notify } from 'quasar'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      test: '123132'
    },
    getters: {

    },
    actions: {
      registerUser ({ state }, data) {
        firebaseAuth.createUserWithEmailAndPassword(data.email, data.password)
          .then(() => {
            const userID = firebaseAuth.currentUser.uid
            firebaseDB.collection('users').doc(userID)
              .set({ name: data.name, email: data.email, online: true })
              .then(() => {
                Notify.create({ message: 'User was successfully registered!', icon: 'check' })
              })
          })
          .catch(error => {
            if (error.code === 'auth/weak-password') {
              alert('The password is too weak.')
            } else {
              alert(error.message)
            }
            console.log(error)
          })
      },
      loginUser ({ state }, data) {
        firebaseAuth.signInWithEmailAndPassword(data.email, data.password)
          .then(resp => {
            console.log(resp)
          })
          .catch(error => {
            if (error.code === 'auth/wrong-password') {
              alert('Wrong password.')
            } else {
              alert(error.message)
            }
            console.log(error)
          })
      }
    },
    mutations: {

    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
