import { create } from 'zustand'

const useStore = create(set =>({

  isShowDetailForm : true,
  setShowDetailForm : (e)=> set(state=>({isShowDetailForm : e}))

}))
export default useStore