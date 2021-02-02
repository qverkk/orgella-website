import { ChakraProvider, ColorModeScript, CSSReset } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

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

// export async function getServerSideProps(context) {
//   const request = context.req;
//   if (request) {
//     var cookies = cookie.parse(request.headers.cookie || "");
//     if (!!cookies["UserInfo"]) {
//       var decoded = jwt.decode(cookies["UserInfo"], { complete: true });
//       return {
//         props: {
//           authenticated: true,
//           userId: decoded.payload,
//         },
//       };
//     }
//   }

//   return {
//     props: {
//       authenticated: false,
//       token: null,
//     },
//   };
// }
