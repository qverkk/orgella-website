import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function SliderInput({ callback, details }) {
  const [value, setValue] = useState(0);

  const handleChange = (value) => {
    setValue(value > details.quantity ? details.quantity : value);
    callback(value);
  };

  return (
    <Flex>
      <NumberInput
        maxW="100px"
        mr="2rem"
        value={value}
        onChange={handleChange}
        max={details.quantity}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        w={300}
        value={value}
        onChange={handleChange}
        max={details.quantity}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={value} />
      </Slider>
    </Flex>
  );
}