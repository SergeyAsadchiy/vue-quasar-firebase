import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseAuth, firebaseDB } from 'boot/firebase'
import { Notify } from 'quasar'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      userDetails: {}
    },
    getters: {},
    actions: {
      registerUser ({ state }, data) {
        firebaseAuth.createUserWithEmailAndPassword(data.email, data.password)
          .then(() => {
            const userID = firebaseAuth.currentUser.uid
            firebaseDB.collection('users').doc(userID)
              .set({ name: data.name, email: data.email, online: true })
              .then(() => {
                Notify.create({
                  message: 'User was successfully registered!',
                  icon: 'check'
                })
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
      },
      logoutUser () {
        firebaseAuth.signOut()
      },
      handleAuthStateChanged ({ state, commit, dispatch }) {
        firebaseAuth.onAuthStateChanged(user => {
          if (user) {
            // User is logged in.
            const userID = firebaseAuth.currentUser.uid
            firebaseDB.collection('users').doc(userID).get()
              .then(resp => {
                const userDetails = resp.data()
                commit('SET_USER_DETAILS', {
                  name: userDetails.name,
                  email: userDetails.email,
                  userID: userID
                })
                dispatch('updateUserInDB', {
                  userID: userID,
                  updates: { online: true }
                })
                this.$router.push('/')
              })
          } else {
            // User is logged out.
            dispatch('updateUserInDB', {
              userID: state.userDetails.userID,
              updates: { online: false }
            })
            commit('SET_USER_DETAILS', {})
            this.$router.push('/auth')
          }
        })
      },
      updateUserInDB ({ state }, payload) {
        if (!payload.userID) return
        firebaseDB.collection('users').doc(payload.userID).update(payload.updates)
      }
    },
    mutations: {
      SET_USER_DETAILS (state, payload) {
        state.userDetails = payload
      }
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
