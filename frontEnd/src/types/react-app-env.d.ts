/// <reference types="react-scripts" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_API_URL: string;
            REACT_APP_HOME_URL: string;
            REACT_APP_AUTH0_URL: string;
            REACT_APP_OPENAI_API_KEY: string;
        }
    }
}
export { };