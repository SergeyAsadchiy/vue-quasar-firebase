import Vue from 'vue'
import Vuex from 'vuex'
import { firebase, firebaseAuth, firebaseDB, firebaseStorage } from 'boot/firebase'
import { firestoreAction, vuexfireMutations } from 'vuexfire'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      userDetails: {},
      users: null,
      chat: null
    },
    getters: {
      users (state) {
        return state.users?.filter(e => e.id !== state.userDetails.userID)
      },
      chat: state => state.chat
    },
    actions: {
      registerUser ({ state }, data) {
        firebaseAuth.createUserWithEmailAndPassword(data.email, data.password)
          .then(() => {
            const userID = firebaseAuth.currentUser.uid
            firebaseDB.collection('users').doc(userID)
              .set({ name: data.name, email: data.email, online: true })
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
      async getUserByID ({ state }, userID) {
        return await firebaseDB.collection('users').doc(userID).get()
      },
      updateUserInDB ({ state }, payload) {
        if (!payload.userID) return
        firebaseDB.collection('users').doc(payload.userID).update(payload.updates)
      },
      sendMessageDB ({ state }, payload) {
        payload.message.createdAt = firebase.firestore.Timestamp.now()
        // to logged user
        firebaseDB.collection('chats').doc(state.userDetails.userID).collection(payload.otherUserID).add(payload.message)
        // to other user
        payload.message.from = 'them'
        firebaseDB.collection('chats').doc(payload.otherUserID).collection(state.userDetails.userID).add(payload.message)
      },
      uploadFileToStorage ({ state }, payload) {
        return new Promise((resolve) => {
          const metadata = {
            createdAt: firebase.firestore.Timestamp.now(),
            fileName: payload.file.name,
            fileType: payload.file.type,
            fileSize: null,
            downloadableURL: ''
          }
          const storageRef = firebaseStorage.ref(payload.path)// .child(childPath);
          const uploadTask = storageRef.put(payload.file, metadata)

          uploadTask.on('state_changed',
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              // Uploaded percent show
              if (payload.percentShowCallBack) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                payload.percentShowCallBack(progress)
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              console.log(error)
            },
            () => {
              // Handle successful uploads on complete
              uploadTask.snapshot.ref.getMetadata().then((spMetadata) => {
                metadata.fileSize = spMetadata.size

                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  metadata.downloadableURL = downloadURL
                  return resolve(metadata)
                })
              })
            }
          )
        })
      },
      deleteFileFromStorage ({ state }, payload) {
        const storageRef = firebaseStorage.ref(payload.path)
        storageRef.delete().then(() => {
          console.log('File deleted successfully')
        }).catch((error) => {
          console.log('Uh-oh, an error occurred!', error.message)
        })
      },

      // subscribes
      bindUsers: firestoreAction(({ state, bindFirestoreRef }) => {
        bindFirestoreRef('users', firebaseDB.collection('users'))
      }),
      bindChat: firestoreAction(({ state, bindFirestoreRef }, otherUserID) => {
        const chats = firebaseDB.collection('chats').doc(state.userDetails.userID).collection(otherUserID)
          .orderBy('createdAt')
        bindFirestoreRef('chat', chats)
      }),
      unbindUsers: firestoreAction(({ unbindFirestoreRef }) => {
        unbindFirestoreRef('users', firebaseDB.collection('users'))
      }),
      unbindChat: firestoreAction(({ unbindFirestoreRef }) => {
        console.log('----- unbindChat')
        unbindFirestoreRef('chat', firebaseDB.collection('chat'))
      })
    },
    mutations: {
      ...vuexfireMutations,

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
