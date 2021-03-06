import React from 'react';
import { Tab } from 'semantic-ui-react'
import UploadTab from './UploadTab';
import LiveStreamTab from './LiveStreamTab';
import Attendance from './attendance';

const panes = [
  {
    menuItem: "Upload Images",
    render: () => <Tab.Pane attached={false}> <UploadTab /></Tab.Pane>,
  },
  {
    menuItem: "Live Stream / Upload Videos",
    render: () => <Tab.Pane attached={false}><LiveStreamTab /></Tab.Pane>,
  },
  {
    menuItem: "Attendance",
    render: () => <Tab.Pane attached={false}><Attendance /></Tab.Pane>,
  },
]

const EmployeeTab = () => {
 
  return (
    <div className="tab-wrap">
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  );
};

export default EmployeeTab;