import { defineStore } from 'pinia';
import { ref } from 'vue';
import { User } from 'app/interfaces/user';

const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<(Partial<User> & { role: string; permissions: string[] }) | null>(null);

    const setProfile = (user: Partial<User> & { role: string; permissions: string[] }) => {
      profile.value = user;
    };

    const getProfile = () => {
      return profile.value;
    };

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
