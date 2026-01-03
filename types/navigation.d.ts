import { Company } from './index';

export type RootStackParamList = {
  Home: undefined;
  Details: { company: Company };
};
