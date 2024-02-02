import React, { useState, useEffect } from 'react';
import PagesHeader from '../../../components/shared/Pageheader';
import { Spinner } from 'react-bootstrap';
import { BsChevronDoubleDown, BsCheckCircle } from "react-icons/bs";
import { Api } from '../../../services';
import { useHistory } from "react-router-dom";
import { UrlConfig } from '../../../config';
import { ProductListAction, SelectedProductAction, PageHistoryAction } from '../../../reduxManager';



const CoursesList = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [condition, setCondition] = useState(false);
    const [coursesListData, setCourseList] = useState([]);
    const [purchesedCourseList, setpurchesedCourseList] = useState([]);

    const [counter, setCounter] = useState(0);
    const [checkExplorerCourses, setCheckExplorerCourses] = useState(false);
    const [flag, setFlag] = useState(false);
    const [showLoader, setLoader] = useState(false);
    const [dataForBreadCrumbs, setDataForBreadCrumbs] = useState(null);
    const headerRightComponenet = () => {
        return <div className="import-btn-main-box">

        </div>
    }

    const purchasesedList = () => {
        setLoader(true);
        const pageNumber = counter + 1;
        Api.getApi('products/my/purchases', { Page: pageNumber, PageSize: 20 })
            .then((response) => {
                if (response) {
                    const { data } = response;
                    if (data) {
                        setpurchesedCourseList(data);
                    } else {
                        setpurchesedCourseList([]);
                    }
                } else {

                    if (!flag) {
                        setFlag(true);
                        getCourseList();
                        setCheckExplorerCourses(!checkExplorerCourses)
                    }
                }
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.log(error, 'Err')
            });
    }


    useEffect(() => {
        purchasesedList()
    }, []);

    const getCourseList = () => {
        setLoader(true);
        const pageNumber = counter + 1;
        Api.getApi('courses', { Page: pageNumber, PageSize: 20 })
            .then((response) => {
                if (response) {
                    const { data } = response;
                    if (data) {
                        setCourseList(data);
                    } else {
                        setCourseList([]);
                    }
                    console.log(data, 'allCourseListallCourseListallCourseListallCourseListallCourseList');
                }
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.log(error, 'Err')
            });
    }
    const getProductList = (id, course) => {
        setLoader(true);
        console.log('course', course);
        const pageNumber = counter + 1;
        Api.getApi('products?coursesId=' + id, { Page: pageNumber, PageSize: 20 })
            .then((response) => {
                if (response) {
                    let { data } = response;
                    if (data) {
                        data.map((e, i) => {
                            let { coursePackage, examPackage, selected } = e
                            selected = false;
                            if (coursePackage && coursePackage.subjects && coursePackage.subjects.length < 0) {
                                coursePackage.subjects.map((s, i) => {
                                    s.isSelectetoPurches_sub = false;
                                    if (s.chapters && s.chapters.length < 0) {
                                        s.chapters.map((c, ci) => {
                                            s.isSelectetoPurches_chap = false;
                                        })
                                    }
                                });
                            }
                        });
                        ProductListAction.setProductList(data);
                        const pageData = [{
                            homePageUrl: '/',
                            previousPageUrl: UrlConfig.routeUrls.learning,
                            previousPageName: "Learning",
                            selectedCourseName: course.name
                        }]
                        PageHistoryAction.setPageHistory(pageData);
                        redirectPage('/productList', id)
                    } else {

                    }
                    console.log(data, 'productListData');
                } else {
                }
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.log(error, 'Err')
            });
    }
    const redirectPage = (url, id) => {
        history.push(
            {
                pathname: UrlConfig.routeUrls.productList,
                productID: id,
                // previousPageData: course
            }
        );
    }
    useEffect(() => {
        console.log(purchesedCourseList, 'purchesedCourseListpurchesedCourseListpurchesedCourseList')
    }, [purchesedCourseList]);

    const purchesedCourseListView = () => {
        return <div>
            {
                purchesedCourseList && purchesedCourseList.length !== 0 ? purchesedCourseList.map((course, index) => {
                    const { id } = course;
                    const { name, description, productType } = course.product;
                    return <div onClick={() => {
                        if (productType === 2) {
                            SelectedProductAction.setSelectedProduct(course.product);

                        }
                        history.push(
                            {
                                pathname: productType === 1 ? UrlConfig.routeUrls.exam : UrlConfig.routeUrls.PurchaseProductDetails,
                                productDetails: course
                            }
                        );

                    }} className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>


                        <div className="card-box-inner-wrapper col-md-12">
                            <div className="dark-card">
                                <div className="exapand-card-row">
                                    <div className="row" style={{ alignItems: 'center' }}>
                                        <div className="col-sm-1">
                                            <div className="exapand-card-col exapand-card-col-id">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box">
                                                        <span className="common-text-exapand-id">{index + 1}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="exapand-card-col">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box align-left">
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
                                        <div className="col-sm-3">
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

                    </div>
                }) :
                    <div className="no-data-found-explorer">
                        <h3>No data found</h3>
                    </div>
            }
        </div>

    }
    const courseList = () => {
        return (
            <div>
                {
                    coursesListData.length !== 0 ? coursesListData.map((course, index) => {
                        const { id, name, description } = course

                        return <div onClick={() => {
                            console.log('course', course);

                            getProductList(id, course);
                        }} className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>


                            <div className="card-box-inner-wrapper col-md-12">
                                <div className="dark-card">
                                    <div className="exapand-card-row">
                                        <div className="row" style={{ alignItems: 'center' }}>
                                            <div className="col-sm-1">
                                                <div className="exapand-card-col exapand-card-col-id">
                                                    <div className="exapnd-card-box">
                                                        <div className="id-box">
                                                            <span className="common-text-exapand-id">{index + 1}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="exapand-card-col">
                                                    <div className="exapnd-card-box">
                                                        <div className="id-box align-left">
                                                            <span className="common-text-exapand align-left" title={'name'}>{name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="exapand-card-col">
                                                    <div className="exapnd-card-box">
                                                        <div className="id-box">
                                                            <span style={{ float: "left" }} className="common-text-exapand-id">{description}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="exapand-card-col exapand-card-col-arrow-button">
                                                    <div className="exapnd-card-box">
                                                        <div className="expand-arrow-box-exam">
                                                            <div className={open ? 'expand-btn-box' : 'expand-btn-box active'}>
                                                                <button type="submit" className="btn btn-arrow text-muted">
                                                                    <BsChevronDoubleDown />
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

                        </div>
                    }) :
                        <div className="no-data-found-explorer">
                            <h3>No data found</h3>
                        </div>
                }
            </div>
        )
    }
    return (
        <div>
            <PagesHeader headerText={"Courses"} customElementsComponent={headerRightComponenet} />
            <div className="common-dark-box">
                <div className="common-title-wrapper-dark">
                    <h3 className="common-dark-box-title">Courses List</h3>
                    <h3 onClick={() => {
                        getCourseList();
                        setCheckExplorerCourses(!checkExplorerCourses)
                    }} className="common-dark-box-title">{!checkExplorerCourses ? 'Explore Courses' : purchesedCourseList.length !== 0 && "Purchased"}</h3>
                </div>

                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }

                {
                    !checkExplorerCourses ? purchesedCourseListView() : courseList()
                }
            </div>

        </div >
    )
}

export default CoursesList;