import { create } from 'zustand';

export const showLoginModal = create((set) => ({
  isShow: false,
  showModal: () => set((state) => ({ isShow: true })),
  closeModal: () => set((state) => ({ isShow: false })),
  onFinish: () => set((state) => ({ isShow: false })),
}));

export const isLogin = create((set) => ({
  isLogin: true,
  setIsLogin: (value) => set((state) => ({ isLogin: value })),
}));

export const isDelete2 = create((set) => ({
  isDelete: true,
  setIsDelete: (value) => set((state) => ({ isDelete: value })),
}));


export const showMessageM = create((set) => ({
  isOpen: false,
  dotStatus : true,
  showMessage: () => set((state) => ({ isOpen: true })),
  closeMessage: () => set((state) => ({ isOpen: false })),
  setDot: () => set((state) => ({ dotStatus: false })),
  
}));
