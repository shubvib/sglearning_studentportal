import React, { useState, useEffect } from 'react';
import { BsCloudUpload } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr';
import { CSVReader } from 'react-papaparse';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
const buttonRef = React.createRef();

const PagesHeader = ({ headerText, customElementsComponent }) => {

    // File Validation End

    return (
        <div>
            <div className="page-header-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        {headerText}
                    </h3>
                    <div className="right-side-box">
                        <div className="upload-box">
                            {customElementsComponent && customElementsComponent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PagesHeader;