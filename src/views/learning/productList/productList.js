import React, { useState, useEffect } from 'react';
import { Spinner, Breadcrumb } from 'react-bootstrap';
import { FaBook, FaRupeeSign } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { BiRupee } from "react-icons/bi";
import moment from 'moment';
import { Api, CommonApiCall, Network } from '../../../services';
import { UrlConfig } from '../../../config';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { ProductListAction, SelectedProductAction, PageHistoryAction } from '../../../reduxManager';
import EnumConfig from '../../../config/EnumConfig';
import assets from '../../../assets';
const ProductList = (props) => {
    const history = useHistory();
    // const { name, pathUrl, pageName } = (props.location && props.location.previousPageData) || {};
    // const { name, pathUrl, pageName } = previousPageData;


    const [open, setOpen] = useState(false);
    const [condition, setCondition] = useState(false);
    const [productListData, setProductList] = useState([]);
    const [counter, setCounter] = useState(0);
    const [showLoader, setLoader] = useState(true);
    const [productID, setProductID] = useState('');

    const headerRightComponenet = () => {
        return <div className="import-btn-main-box">

        </div>
    }
    useEffect(() => {
        if (props.productList && props.productList.length > 0) {
            console.log('props.productList', props.productList);
            setProductList(props.productList)
        }
        setLoader(false);
        return () => {
            setProductList(null);
        }
    }, [props.productList]);

    useEffect(() => {
        console.log('productListData', productListData);
    }, [productListData]);

    const calculatePercentage = (MRPPrice, discountPrice) => {
        let price = (MRPPrice / 100) * discountPrice
        price = MRPPrice - price
        return price;
    }

    const pageRedirection = (routerUrl) => {
        history.push({
            pathname: routerUrl,
            message: "From Product List"
        })
    }

    const breadCrumbsView = () => {
        return <div>
            {props.pageHistory &&
                <Breadcrumb>
                    <Breadcrumb.Item
                        onClick={() => {
                            pageRedirection(props.pageHistory[0].previousPageUrl);
                        }}
                    >{props.pageHistory[0].previousPageName}</Breadcrumb.Item>
                    <Breadcrumb.Item >{props.pageHistory[0].selectedCourseName}</Breadcrumb.Item>
                </Breadcrumb>}
        </div>
    }
    return (
        <div>
            <div className="common-dark-box">
                <div className="common-title-wrapper-dark">
                    <h3 className="common-dark-box-title">Product List</h3>
                    {breadCrumbsView()}
                </div>
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                <div className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>
                    <div className="product-list-warpper">
                        <div className="row">
                            {
                                productListData && productListData.length !== 0 ? productListData.map((course, index) => {
                                    const { id, name, coursePackage, examPackage, productType, isFree, isPartialOrFullPurchased } = course;

                                    let packages = (productType === EnumConfig.ProductType.videoPackages) ? coursePackage : examPackage;
                                    // let packages = coursePackage ? coursePackage : examPackage
                                    if (packages === null) {
                                        console.log('packages', packages);
                                        console.log('course', course);
                                        return null;
                                    }

                                    const { price, discountInPercent } = packages;

                                    return <div className="col-sm-3" key={`productList_${index}`}>
                                        <div className="product-wrap hvr-float-shadow" onClick={() => {
                                            let data = productListData;
                                            data[index].selected = !data[index].selected;
                                            let product = data[index];
                                            if (isPartialOrFullPurchased === true && (coursePackage.purchaseDetails !== null || examPackage.purchaseDetails !== null)) {
                                                console.log('aaaaaa')
                                                history.push(
                                                    {
                                                        pathname: productType === EnumConfig.ProductType.videoPackages ? UrlConfig.routeUrls.learning : UrlConfig.routeUrls.exam
                                                    }
                                                );
                                            } else {
                                                if (productType === EnumConfig.ProductType.videoPackages) {
                                                    product && product.coursePackage.subjects && product.coursePackage.subjects.map((sub, sID) => {
                                                        sub.isSubSelected = 1;
                                                        sub.chapters && sub.chapters.map((ch) => {
                                                            ch.ischapterSelected = 1;
                                                        })
                                                    });
                                                } else {
                                                    (product && product.examPackage && product.examPackage.subjects) && product.examPackage.subjects.map((sub, sID) => {
                                                        sub.isSubSelected = 1;
                                                        sub.chapters && sub.chapters.map((ch) => {
                                                            ch.ischapterSelected = 1;
                                                        })
                                                    });
                                                }
                                                ProductListAction.resetProductList([]);
                                                SelectedProductAction.setSelectedProduct(product);
                                                ProductListAction.setProductList(data);

                                                history.push(
                                                    {
                                                        pathname: productType === EnumConfig.ProductType.videoPackages ? UrlConfig.routeUrls.productDetails : UrlConfig.routeUrls.ProductDetailsExam,
                                                        data: course
                                                    }
                                                );
                                            }

                                        }}>
                                            <div className="product-wrap-img">
                                                <img src={productType === EnumConfig.ProductType.examPackages ? assets.images.Silver_Card : assets.images.Gold_Card} alt="product_img" />
                                            </div>
                                            <div className="product-wrap-info">
                                                <span className="product-name" title={name ? name : 'Product name not available'}>{name ? name : 'Product name not available'}</span>
                                                <div className="product-wrap-amt-box">
                                                    <p>
                                                        {!isFree ? <><span className="product-amt-mrp"><FaRupeeSign />{calculatePercentage(price, discountInPercent)}</span>
                                                            <span className="product-amt"><BiRupee />{price}</span></> : <span className="product-amt-mrp-free">Free</span>}
                                                        {isPartialOrFullPurchased === true && <span style={{ backgroundColor: "#345ad7", marginLeft: "5px" }} className="product-amt-mrp-free">Purchased</span>}
                                                    </p>
                                                    <p>
                                                        {discountInPercent ? <span className="product-amt-dis">{discountInPercent}% OFF</span> : <></>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="product-wrap-buy-now-btn-box">
                                                {isPartialOrFullPurchased === false &&
                                                    (!isFree ? <button type="submit"
                                                        className={
                                                            (course.coursePackage.purchaseDetails) ? "btn-product-buy-now hvr-icon-wobble-horizontal disabled" : "btn-product-buy-now hvr-icon-wobble-horizontal"
                                                        }>Buy Now </button>
                                                        : <button type="submit"
                                                            className={
                                                                (course.coursePackage.purchaseDetails) ? "btn-product-buy-now hvr-icon-wobble-horizontal disabled" : "btn-product-buy-now hvr-icon-wobble-horizontal"
                                                            }>Get For Free </button>)
                                                }
                                                {isPartialOrFullPurchased && isPartialOrFullPurchased === true && !isFree &&
                                                    < span style={{ color: "#5d28c5", fontWeight: "800" }}
                                                        className="btn-product-buy-now hvr-icon-wobble-horizontal"
                                                    >{(coursePackage.purchaseDetails !== null) ? "purchased" : 'partially-purchased'}</ span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                })
                                    :
                                    !showLoader ?
                                        <div className="no-data-found" style={{ textAlign: 'center', width: '100%' }}>
                                            <h3>Products not available for this selection</h3>
                                        </div> : <></>
                            }
                        </div>
                    </div>

                </div>
            </div>

        </div >
    )
}


const mapPropsToState = (state) => {
    return {
        productList: state.productList,
        pageHistory: state.pageHistory
    }
}
export default connect(mapPropsToState)(ProductList);
