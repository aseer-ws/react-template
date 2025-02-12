/**
 *
 * T
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';
import If from '@components/If';
import { fonts } from '@app/themes';

export function getLimitLineCSS(noOfLines) {
  return `
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${noOfLines}; 
  line-clamp: ${noOfLines}; 
  -webkit-box-orient: vertical;`;
}

const StyledText = styled.p`
  && {
    ${(props) => props.marginBottom && `margin-bottom: ${props.marginBottom}px;`};
    ${(props) => props.font()};
    /* limit no. of lines to n: https://stackoverflow.com/a/13924997/18099482  */
    ${(props) => props.noOfLines && getLimitLineCSS(props.noOfLines)}
  }
`;
const getFontStyle = (type) => (fonts.style[type] ? fonts.style[type] : () => {});
export const T = ({ type, text, id, marginBottom, values, ...otherProps }) => (
  <StyledText data-testid="t" font={getFontStyle(type)} marginBottom={marginBottom} {...otherProps}>
    <If condition={id} otherwise={text}>
      <FormattedMessage id={id} values={values} />
    </If>
  </StyledText>
);

T.propTypes = {
  id: PropTypes.string,
  marginBottom: PropTypes.number,
  values: PropTypes.object,
  text: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(fonts.style))
};

T.defaultProps = {
  values: {},
  type: 'standard'
};

const TextComponent = memo(T);
export default TextComponent;
