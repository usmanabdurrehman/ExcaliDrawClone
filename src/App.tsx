import { ChakraProvider } from "@chakra-ui/react";
import { ExcaliDraw } from "./Components";
import MultiPointLine from "./Components/MultiPointLine/MultiPointLine";
import "./index.css";

export default function App() {
  return (
    <ChakraProvider>
      <ExcaliDraw />
    </ChakraProvider>
  );
}
