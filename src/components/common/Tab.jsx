/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import styled from 'styled-components';

const StTab = styled.div`
  width: 100%;
  height: 100%;
`;

const TabMenu = styled.ul`
  color: rgba(116, 107, 95, 0.5);
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;

  .submenu {
    display: flex;
    justify-content: center;
    font-family: 'TTTogether';
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    width: calc(100% / 2);
    padding: 10px 10px 20px 10px;
    border-bottom: 1px solid;
    cursor: pointer;
    /* transition: 0.5s; */
  }

  .focused {
    color: ${({ theme }) => theme.colors.DIM_GRAY};
    border-bottom: 4px solid;
  }

  & div.desc {
    text-align: center;
  }
`;

const Desc = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 0 55px 15px;
  ${({ theme }) => theme.common.flexCenter};
`;

function Tab({ menu }) {
  const [currentTab, clickTab] = useState(0);

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

  return (
    <StTab>
      <TabMenu>
        {menu.map((el, index) => (
          <li
            key={String(index)}
            className={index === currentTab ? 'submenu focused' : 'submenu'}
            onClick={() => selectMenuHandler(index)}
          >
            {el.menu}
          </li>
        ))}
      </TabMenu>
      <Desc>{menu[currentTab].content}</Desc>
    </StTab>
  );
}

export default Tab;
