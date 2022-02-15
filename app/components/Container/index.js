import styled from 'styled-components';

export default styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2rem auto;
  max-width: ${(props) => props.maxWidth}px;
  padding: ${(props) => props.padding}rem;
`;
