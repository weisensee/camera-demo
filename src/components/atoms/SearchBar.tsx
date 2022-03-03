import React, { memo } from 'react';
import {
    SearchBar as RNESearchBar,
    SearchBarAndroidProps,
    SearchBarDefaultProps,
    SearchBarIosProps,
} from 'react-native-elements';
import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar';

const SearchBar = RNESearchBar as unknown as React.FC<
    SearchBarBaseProps | SearchBarDefaultProps | SearchBarAndroidProps | SearchBarIosProps
>;

export default memo(SearchBar);
