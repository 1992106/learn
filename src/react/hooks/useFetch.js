const useFetch = ({ url, method = 'GET' } = options, { initialData } = config) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async(body) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null
      })
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, run: fetchData };
}

// https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}

// https://www.robinwieruch.de/react-hooks-fetch-data/
const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(fetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await fetch(url).then(response => response.json());

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};
