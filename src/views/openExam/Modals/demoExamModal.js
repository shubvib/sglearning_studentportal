import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Carousel } from 'react-bootstrap';
import assets from '../../../assets';

const DemoExamModal = (props) => {
    const { showDemoExamModal, handleCloseDemoExamModal } = props;
    return (

        <div className="modal-main-dark">
            <Modal show={showDemoExamModal} onHide={handleCloseDemoExamModal} size="lg" className="modal-dark demo-exam-main-modal" centered>
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3>How Exam Looks?</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="demo-exam-wrapper">
                        <Carousel keyboard={true}>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner1} className="d-block" alt="First slide" />
                                {/* <Carousel.Caption>
                                    <h3>Exam Name 1</h3>
                                    <button type="submit" class="btn-launch">Launch</button>
                                </Carousel.Caption> */}
                                {/* <div className="banner-overlay"></div> */}
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner2} className="d-block" alt="Second slide" />
                                {/* <Carousel.Caption>
                                    <h3>Exam Name 2</h3>
                                    <button type="submit" class="btn-launch">Launch</button>
                                </Carousel.Caption> */}
                                {/* <div className="banner-overlay"></div> */}
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner3} className="d-block" alt="Third slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner4} className="d-block" alt="Fourth slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner5} className="d-block" alt="Fifth slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner6} className="d-block" alt="Sixth slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner7} className="d-block" alt="Seven slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner8} className="d-block" alt="Eight slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={assets.images.examTourBanner9} className="d-block" alt="Nine slide" />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <div className="footer-btn-box">
                        <Button variant="primary" className="uploadeBtn">
                            Discard
                        </Button>
                        <Button variant="secondary" className="closeBtn">
                            Cancel
                    </Button>
                    </div>
                </Modal.Footer> */}
            </Modal>
        </div>
    )
}
export default DemoExamModal;
