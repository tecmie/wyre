import React, {useState} from 'react';
import ViewLayout from "../../components/core/ViewLayout";
import {
    Stack,
    SimpleGrid,
    Text,
  } from "@chakra-ui/react";
import Onboarding from './onbording';
import Preview from './preview';


const Index: React.FC = () => {
  const [isNew, setIsNew] = useState(false);
  return (
    <ViewLayout title='Dashboard'>
      <Stack spacing={'6'} >
        {isNew ?
          <Onboarding/>
          :
          <Preview/>
        }
      </Stack>
    </ViewLayout>
  )
};

export default Index;