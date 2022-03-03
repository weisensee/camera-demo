import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const TILE_WIDTH = Math.min(173, width * 0.4);
const TILES_PER_ROW = Math.floor(width / TILE_WIDTH);
const PADDING_WIDTH_TOTAL = width - TILE_WIDTH * TILES_PER_ROW;
const TILE_PADDING = 10;
const TAB_CARDS_PER_ROW = Math.floor(TILES_PER_ROW / 2);

export default {
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,
    TAB_CARDS_PER_ROW,
    TILE_WIDTH,
    TILES_PER_ROW,
    PADDING_WIDTH_TOTAL,
    TILE_PADDING,
};
