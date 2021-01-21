import { ChakraProvider, ColorModeScript, CSSReset } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import cookie from "cookie";
import { authStore } from "../store/zustand";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export async function getStaticProps(context) {
  const request = context.req;
  if (request) {
    var cookies = cookie.parse(request.headers.cookie || "");
    if (!!cookies["UserInfo"]) {
      const { authenticate } = authStore();
      authenticate();
    }
  }
}
