import React from "react";

import { StyledButton } from './Button.styles.ts';

type ButtonType = {
    children: string;
    click: () => {};
}

const Button: React.FC<ButtonType> = ({ click, children }) => {
    return (
        <StyledButton onClick={click}>
            {children}
        </StyledButton>
    );
}

export default Button;
