import React, { useState, useEffect, useLayoutEffect } from 'react';
import PagesHeader from '../../components/shared/Pageheader';
import { Spinner } from 'react-bootstrap';
import { BsCheckCircle } from "react-icons/bs";
import { FcStart, FcKindle } from 'react-icons/fc';
import { Api } from '../../services';
import { Link, useHistory } from "react-router-dom";
import { EnumConfig, UrlConfig } from '../../config';
import { PageHistoryAction, SelectedProductAction } from '../../reduxManager';

const Learning = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [condition, setCondition] = useState(false);
    const [purchesedCourseList, setpurchesedCourseList] = useState([]);
    const [counter, setCounter] = useState(0);
    const [flag, setFlag] = useState(false);
    const [showLoader, setLoader] = useState(false);

    useLayoutEffect(() => {
        purchasedList()
    }, []);

    useEffect(() => {
        console.log(purchesedCourseList, 'purchesedCourseList====>')
    }, [purchesedCourseList]);

    const purchasedList = () => {
        setLoader(true);
        const pageNumber = counter + 1;
        Api.getApi(UrlConfig.apiUrls.getMyPurchases, { Page: pageNumber, PageSize: 20 })
            .then((response) => {
                if (response) {
                    const { data } = response;
                    if (data) {
                        console.log('dataaaaaa', data);
                        // setpurchesedCourseList(data);
                        filterVideoCourses(data);
                    } else {
                        setpurchesedCourseList([]);
                    }
                } else {
                    if (!flag) {
                        setFlag(true);
                    }
                }
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.log(error, 'Err')
            });
    }

    const filterVideoCourses = (allData) => {
        let videoPackages = [];
        allData && allData.map((data) => {
            const { product } = data;
            if (product.productType === EnumConfig.ProductType.videoPackages) {
                videoPackages.push(data);
            }
        })
        setpurchesedCourseList(videoPackages);
    }

    const purchesedCourseListView = () => {
        return <div>
            {

                (purchesedCourseList && purchesedCourseList.length > 0) ? purchesedCourseList.map((course, index) => {
                    const { id, product } = course;
                    const { name, description, productType } = product;

                    return (productType === EnumConfig.ProductType.videoPackages && <div
                        key={`purchasedProducts_${id}`}
                        onClick={() => {
                            if (productType === EnumConfig.ProductType.videoPackages) {
                                SelectedProductAction.setSelectedProduct(product);
                                const pageData = [{
                                    homePageUrl: '/',
                                    previousPageUrl: UrlConfig.routeUrls.learning,
                                    previousPageName: "Learning",
                                    selectedCourseName: name
                                }]
                                PageHistoryAction.setPageHistory(pageData);
                            }
                            history.push({
                                pathname: productType === EnumConfig.ProductType.examPackages ? UrlConfig.routeUrls.exam : UrlConfig.routeUrls.purchasedProductDetails,
                                productDetails: course
                            });
                        }} className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>
                        <div className="card-box-inner-wrapper col-md-12">
                            <div className="dark-card">
                                <div className="exapand-card-row">
                                    <div className="row" style={{ alignItems: 'center' }}>
                                        <div className="col-sm-1">
                                            <div className="exapand-card-col exapand-card-col-id">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box">
                                                        {/* <span className="common-text-exapand-id">{index + 1}</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="exapand-card-col">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box align-left">
                                                        {productType === EnumConfig.ProductType.videoPackages ?
                                                            <span style={{ marginRight: "15px" }}><FcStart size={25} /></span> : <span style={{ marginRight: "15px" }}><FcKindle size={25} /></span>
                                                        }
                                                        <span className="common-text-exapand align-left" title={'name'}>{name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="exapand-card-col">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box">
                                                        <span className="common-text-exapand-id">{description}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-2">

                                            <div className="exapand-card-col exapand-card-col-arrow-button">
                                                <div className="exapnd-card-box">
                                                    <div className="expand-arrow-box-exam">
                                                        <div className={open ? 'expand-btn-box' : 'expand-btn-box active'}>
                                                            <button type="submit" className="btn  BsCheckCircle-purchesed">
                                                                <BsCheckCircle />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>)
                }) :
                    <div className="no-data-found-explorer" style={{ display: "flex", flexDirection: "column" }}>
                        <h2 style={{ color: "white" }}>Looks like You have not Purchased any Courses yet !!!</h2>
                        {/* <h2 ><Link to="/exploreCourses">Explore Courses...</Link></h2> */}
                        <h2><Link to="/exploreCourses">Start Exploring Paid and <span style={{}} className='free-courses-span'>Free Courses...</span> </Link></h2>
                    </div>
            }
        </div>
    }
    return (
        <div>
            {/* <PagesHeader headerText={"Purchased Courses"} /> */}
            <div className="common-dark-box">
                <div className="common-title-wrapper-dark">
                    <h3 className="common-dark-box-title">Purchased Courses</h3>
                </div>
                {
                    showLoader ?
                        <div className="loader">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        : purchesedCourseListView()
                }
            </div>

        </div >
    )
}

export default Learning;