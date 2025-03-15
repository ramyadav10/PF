<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
    <div class="w-full max-w-md bg-white p-10 shadow-2xl rounded-xl border border-gray-300">
      <h2 class="text-3xl font-extrabold text-center text-gray-900 mb-6">Welcome Back</h2>
      <p class="text-center text-gray-500 mb-6">Sign in to continue</p>
      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" id="email" v-model="email" required 
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" 
            placeholder="Enter your email" />
        </div>
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700">Password</label>
          <input type="password" id="password" v-model="password" required 
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" 
            placeholder="Enter your password" />
        </div>
        <button type="submit" 
          class="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105">
          Sign In
        </button>
      </form>
      <p class="text-center text-gray-600 mt-4">Don't have an account? <a href="#" class="text-indigo-500 font-semibold">Sign up</a></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      if (this.email === 'admin@example.com' && this.password === 'password123') {
        alert('Login successful!');
        this.$router.push('/home'); // Redirect to /home
      } else {
        alert('Invalid email or password');
      }
    }
  }
};
</script>

<style scoped>
button {
  transition: all 0.3s ease-in-out;
}
</style>
