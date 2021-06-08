import styled from "styled-components";

export const Header = styled.header`
  background-color: #ecffe9;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: black;
`;

export const OuterContainer = styled.div`
  background-color: #ecffe9;
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: calc(10px + 1vmin);
  min-height: calc(100vh - 70px);
  padding-top: 20px;
`;

export const Logo = styled.img`
  height: 5vmin;
  pointer-events: none;
  margin-left: 20px;
`;

export const Button = styled.button`
  background: rgb(131,102,255);
  background: linear-gradient(270deg, rgba(131,102,255,1) 0%, rgba(110,231,118,1) 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  margin: 0px 20px;
  padding: 12px 24px;

  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }

  &:hover {
    opacity: 80%;
  }
`;

export const Balances = styled.div`
  border-radius: .5rem;
  box-shadow: 2px 3px 4px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  padding: 20px;
  background-color: white;
  font-size: calc(10px + .7vmin);
  height: 100%;
  margin-left: 20px;
  order: 1;
  width: 300px;
  font-weight: bold;
`;

export const BalanceValue = styled.span`
  float: right;
  font-weight: normal;
`;

export const CardContainer = styled.div`
  order: 2;
  border-radius: .5rem;
  box-shadow: 2px 3px 4px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  padding: 20px;
  background-color: white;
  font-size: calc(10px + .7vmin);
  margin-left: 20px;
  width: calc(100% - 440px);
  height: 100%;
`;

export const CardImage = styled.img`
  margin: 10px;
`;