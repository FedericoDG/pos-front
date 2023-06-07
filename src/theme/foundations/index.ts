import borders from './borders';
import colors from './colors';
import radii from './radius';
import shadows from './shadows';
import sizes from './sizes';
import spacing from './spacing';
import transition from './transition';
import typography from './typography';
import zIndices from './z-index';
import blur from './blur';

const foundations = {
  zIndices,
  radii,
  blur,
  colors,
  ...typography,
  sizes,
  shadows,
  space: spacing,
  borders,
  transition,
};

export default foundations;
