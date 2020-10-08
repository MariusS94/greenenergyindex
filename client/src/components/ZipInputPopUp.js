import React, { useState } from "react";
import InputField from "./InputField";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const ZipInputWindow = styled.div`
  position: relative;
  background: rgb(105, 105, 105, 0.5);
  height: 15rem;
  width: 80%;
  display: flex;
  justify-content: top;
  align-items: center;
  flex-direction: column;
  padding-top: 2rem;
  border-radius: 2rem;
`;

const SubmitButton = styled.button`
  border: none;
  padding: 0.2rem;
  margin-top: 3rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid;
  color: #ffffff;
`;

const CloseingItem = styled.span`
  position: absolute;
  right: 1rem;
  top: 1rem;
`;

export const ZipInputPopUp = (props) => {
  const [query, setQuery] = useState("");
  const history = useHistory();

  const handleClick = () => {
    localStorage.setItem("zip", query);
    history.push(`/energy/forecast/${query}`);
  };

  return (
    <ZipInputWindow>
      <CloseingItem onClick={props.handleClose}>x</CloseingItem>
      <InputField
        value={query}
        onChange={(value) => setQuery(value)}
        placeholder="PLZ Eingabe"
      />
      <SubmitButton onClick={handleClick} disabled={query.length === 5}>
        Bestätigen
      </SubmitButton>
    </ZipInputWindow>
  );
};

export default ZipInputPopUp;

ZipInputPopUp.propTypes = {
  handleClose: PropTypes.func,
  callBackFunc: PropTypes.func,
};
