import React from 'react';
import { Menu, MenuItem } from '@progress/kendo-react-layout';
import { useHistory } from 'react-router-dom';


const MenuNavContainer = (props) => {
    const history = useHistory();
    const onSelect = (event) => {
        history.push(event.item.data.route);
    }
    return (
        <Menu onSelect={onSelect}>
            <MenuItem text="Logout" data={{ route: '/' }}/>
            {/* <MenuItem text="Blank1" data={{ route: '/Blank1' }}/> */}
            {/* <MenuItem text="Agent Work" data={{ route: '/agent-work' }}/> */}
            {/* <MenuItem text="Grid1" data={{ route: '/Grid1' }}/>
            <MenuItem text="Chart1" data={{ route: '/Chart1' }}/> */}
        </Menu>
    );
}

export default MenuNavContainer;
