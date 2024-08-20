/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { useCallback, useState } from "react";
import Axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const ACCESS_TOKEN = import.meta.env.VITE_USER_ACCESS_UUID;

const axios = Axios.create({
  timeout: 20000,
  withCredentials: false,
});

axios.defaults.baseURL = API_URL;

type Method = "post" | "get";

type Request = {
  url: string;
  method: Method;
  headers?: any;
  body?: any;
};

type UseRequest = {
  makeRequest: (input: Request) => Promise<any>;
  error: Error | undefined;
  loading: boolean;
};

const getSession: any = () => {
  try {
    return JSON.parse(localStorage.getItem("session") || "");
  } catch (e) {
    // error reading value
    return {};
  }
};

axios.interceptors.request.use(
  async (config) => {
    const session = getSession();

    if (session.token) {
      // config.headers["X-API-KEY"] = session.token;
      config.headers["X-API-KEY"] = ACCESS_TOKEN;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const useRequest = (): UseRequest => {
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);

  const makeRequest = useCallback(
    async ({ url, method, body, headers = {} }: Request) => {
      setLoading(true);

      return axios[method](url, body, headers)
        .then(({ data }): any => {
          setLoading(false);

          return data;
        })
        .catch((err) => {
          console.log(
            `makeRequest Error: url:(${API_URL}${url}) body(${JSON.stringify(
              body
            )})`,
            err.message
          );

          setError(err);
          setLoading(false);

          return err;
        });
    },
    [setLoading]
  );

  return { makeRequest, error, loading };
};

export default useRequest;
