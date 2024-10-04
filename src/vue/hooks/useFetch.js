const useFetch = ({ url, method = 'GET' } = options, { initialData } = config) => {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const fetchData = async (body) => {
    try {
      loading.value = true;
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      data.value = await response.json();
  } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    error,
    loading,
    run: fetchData
  }
}
