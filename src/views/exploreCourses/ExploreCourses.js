import React, { useState, useEffect } from 'react';
import PagesHeader from '../../components/shared/Pageheader';
import { Spinner } from 'react-bootstrap';
import { BsChevronDoubleDown } from "react-icons/bs";
import { Api } from '../../services';
import { useHistory } from "react-router-dom";
import { UrlConfig } from '../../config';
import { ProductListAction, PageHistoryAction } from '../../reduxManager';
import CommonFunctions from '../../utils/CommonFunctions';
import { toast } from 'react-toastify';



const ExploreCourses = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [condition, setCondition] = useState(false);
    const [coursesListData, setCourseList] = useState([]);
    const [counter, setCounter] = useState(0);
    const [showLoader, setLoader] = useState(false);

    useEffect(() => {
        getCourseList();
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

    const [productList, setProductList] = useState();
    const [id, setId] = useState(null);
    const [course, setCourse] = useState(null);
    const getProductList = (id, course) => {

        console.log('course', course);
        const pageNumber = counter + 1;
        Api.getApi('products?courseId=' + id, { Page: pageNumber, PageSize: 20 })
            .then((response) => {
                if (response) {
                    console.log('allProducts', response);
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
                        setId(id);
                        setCourse(course);
                        setProductList(data)
                        // setDataAndRedirect(data, course, id);

                    } else {
                        setId(id);

                        setCourse(course);
                        setProductList(null);
                        // setDataAndRedirect(null, course, id);
                    }
                    console.log(data, 'productListData');
                } else {
                    setId(id);
                    toast.info("Course not available.");
                    setCourse(course);
                    setProductList(null);
                    // setDataAndRedirect(null, course, id);
                }
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.log(error, 'Err')
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }

    const setDataAndRedirect = (data, course, id) => {
        console.log('data', data);
        console.log('course', course);
        console.log('id', id);
        if (data && data.length > 0) {
            console.log('data && data.length > 0', data);
            ProductListAction.setProductList(data);
        } else {
            ProductListAction.resetProductList();
        }

        console.log('history', history);
        const pageData = [{
            previousPageUrl: UrlConfig.routeUrls.exploreCourses,
            previousPageName: "Explore Courses",
            selectedCourseName: course.name
        }]
        PageHistoryAction.setPageHistory(pageData);
        productList && redirectPage('/productList', id)
    }

    const redirectPage = (url, id) => {
        history.push(
            {
                pathname: UrlConfig.routeUrls.productList,
                productID: id,
            }
        );
    }

    const [purchasedProductList, setPurchasedProductList] = useState();
    const getPurchasedProductsList = (id, course) => {
        setLoader(true);
        Api.getApi(UrlConfig.apiUrls.getMyPurchases, { PageSize: 100 })
            .then((response) => {
                console.log('purchasedResponse', response)
                if (response) {
                    setPurchasedProductList(response.data);
                    getProductList(id, course);

                }
                else {
                    getProductList(id, course);
                }
                setLoader(false);
            }).catch((error) => {
                console.log('error', error);
                getProductList(id, course);
            })

    }


    useEffect(() => {
        console.log('purchasedProductList', purchasedProductList);
        console.log('productList', productList);
        let updatedCourseList;
        if (purchasedProductList && productList && course) {
            console.log('hello')
            updatedCourseList = CommonFunctions.getFilteredProductList(purchasedProductList, productList);
            setDataAndRedirect(updatedCourseList, course, id)
        } else if (!purchasedProductList && course) {
            console.log('hiii')
            setDataAndRedirect(productList, course, id)
        }
        console.log('updatedCourseList', updatedCourseList);
    }, [purchasedProductList, productList]);

    const courseList = () => {
        return (
            <div>
                <div className="explore-courses-main-wrap">
                    <div className="explore-sub-main-wrap">
                        <div className="row">
                            {
                                coursesListData.length > 0 ? coursesListData.map((course, index) => {
                                    const { id, name, description } = course
                                    return <div className="col-sm-4" key={`coursesList_${id}`
                                    } onClick={() => {
                                        console.log('course', course);
                                        getPurchasedProductsList(id, course);



                                    }} >
                                        <div className={index === 0 || index === 1 ? (index == 0 ? "explore-courses-main-bx frist-bx-ex" : 'explore-courses-main-bx second-bx-ex') : (index === 3 ? 'explore-courses-main-bx third-bx-ex' : 'explore-courses-main-bx fourth-bx-ex')}>
                                            <div className="explore-courses-bx">
                                                <h3>{name}</h3>
                                                <h4>{description}</h4>
                                            </div>
                                        </div>
                                    </div>
                                }) :
                                    !showLoader ?
                                        <div className="no-data-found" style={{ textAlign: 'center', width: '100%' }}>
                                            <h3>Course not available</h3>
                                        </div> : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <PagesHeader headerText={"Explore Courses"} />
            <div className="common-dark-box">
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                {
                    courseList()
                }
            </div>

        </div >
    )
}

export default ExploreCourses;