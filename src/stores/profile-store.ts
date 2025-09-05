import { defineStore } from 'pinia';
import { ref } from 'vue';
import { User } from 'src/interfaces/user';

const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<(Partial<User> & { role: string; permissions: string[] }) | null>(null);

    const setProfile = (user: Partial<User> & { role: string; permissions: string[] }) => {
      profile.value = user;
    };

    const getProfile = () => {
      if (!profile.value) {
        profile.value = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')!)?.profile : null;
      }
      console.log(profile.value);
      return profile.value;
    };

    getProfile();
    return {
      profile,
      setProfile,
      getProfile,
    };
  },
  {
    persist: true,
  },
);

export default useProfileStore;
