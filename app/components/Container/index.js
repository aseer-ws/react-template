import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2rem auto;
  max-width: ${(props) => props.maxWidth}px;
  padding: ${(props) => props.padding}rem;
`;

Container.propTypes = {
  maxWidth: PropTypes.number,
  padding: PropTypes.number
};

Container.defaultProps = {
  maxWidth: 1000,
  padding: 1
};

export default Container;
