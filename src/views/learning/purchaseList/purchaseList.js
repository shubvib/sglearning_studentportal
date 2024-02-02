import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Form, Accordion, Spinner, Button, Breadcrumb } from 'react-bootstrap';
import { UrlConfig } from '../../../config';
import assets from '../../../assets';
import { connect } from 'react-redux';
import { ProductListAction, SelectedChapterVideoAction, SelectedProductAction } from '../../../reduxManager'
import EnumConfig from '../../../config/EnumConfig';
import { useHistory } from "react-router-dom";


const PurchasesProductDetails = (props) => {
    const history = useHistory();

    const [condition, setCondition] = useState(false);
    const [subjectListdata, setsubjectListdata] = useState([]);
    const [selectedPackage, setselectedPackage] = useState();
    const [showLoader, setLoader] = useState(false);
    const [FinalPrice, setFInalPrice] = useState(0)

    const [IsFullyPurchased, setIsFullyPurchased] = useState(false);

    /****************************************** Calculate Function Start Here********************************************************************/
    const calculatePercentage = (MRPPrice, discountPrice) => {
        let price = (MRPPrice / 100) * discountPrice
        price = MRPPrice - price
        return price;
    }
    /****************************************** Calculate Function End Here********************************************************************/

    /****************************************** UseEffect for subjectList and Key manuplation Start********************************************************************/
    useEffect(() => {
        if (props.selectedProduct.coursePackage) {
            const { subjects, purchaseDetails } = props.selectedProduct.coursePackage;

            const purchasaedSubjectList = purchaseDetails && subjects

            if (purchaseDetails !== null) {
                purchasaedSubjectList.map((sub, ind) => {
                    sub.isPartialOrFullPurchased = true
                })
                setIsFullyPurchased(true);
            }
        }

    }, [props.selectedProduct.coursePackage]);
    useEffect(() => {
        if (props.selectedProduct) {
            if (props.selectedProduct.productType === EnumConfig.ProductType.videoPackages && props.selectedProduct.coursePackage) {
                setselectedPackage(props.selectedProduct.coursePackage);
                setFInalPrice(props.selectedProduct.coursePackage.price)
                props.selectedProduct.coursePackage.subjects && setsubjectListdata(props.selectedProduct.coursePackage.subjects)
            } else {
                if (props.selectedProduct.examPackage) {
                    setselectedPackage(props.selectedProduct.examPackage);
                    setFInalPrice(props.selectedProduct.examPackage.price)
                    props.selectedProduct.examPackage.subjects && setsubjectListdata(props.selectedProduct.examPackage.subjects)
                }
            }
        }
        console.log('props.selectedProduct', props.selectedProduct);
    }, [props.selectedProduct])

    useEffect(() => {
        let price = 0;
        if (props.selectedProduct && props.selectedProduct.coursePackage && props.selectedProduct.coursePackage.price) {
            let ap = props.selectedProduct.coursePackage.price;
            let di = props.selectedProduct.coursePackage.discountInPercent;
            price = calculatePercentage(ap, di);


        }
        setFInalPrice(0);
        let obj = 0;
        let objID = 0;
        subjectListdata.map((sub, index) => {
            if (sub.isSubSelected === 1) {
                objID = objID + 1;
                obj = obj + calculatePercentage(sub.price, sub.discountInPercent);
                setFInalPrice(obj)
            } else if (sub.isSubSelected === 2) {
                sub.chapters.map((ch, cIndex) => {
                    if (ch.ischapterSelected === 1) {
                        obj = obj + calculatePercentage(ch.price, ch.discountInPercent);
                        setFInalPrice(obj)
                    }
                })

            } else {

            }
            objID === subjectListdata.length && setFInalPrice(price)
        });
    }, [subjectListdata]);

    /****************************************** UseEffect For SubjectList and Key Manuplation End********************************************************************/
    /****************************************** Header Function Start Here********************************************************************/
    const header = () => {
        return (
            props.selectedProduct &&
            <div className="common-title-wrapper-dark">
                <h3 className="common-dark-box-title">{props.selectedProduct.name}</h3>
                {breadCrumbsView()}
            </div>
        )
    }
    /****************************************** Header Function End Here********************************************************************/
    /****************************************** Content Check And KeyManuplation Function Start Here********************************************************************/
    const checkIsContentAvailable = (chapters) => {
        const result = chapters.find(chapter => (chapter.content.length > 0));
        return result;
    }
    const manuplateKeys = (chaptersList) => {
        chaptersList.map((sub, ind) => {
            sub.isPartialOrFullPurchased = true
            sub.purchaseDetails = true;
        })

    }
    /****************************************** Content Check And KeyManuplation Function End Here********************************************************************/
    /****************************************** subjectLooping Function Start Here********************************************************************/
    const subjectListLooping = (course, index) => {
        const { id, name, imageUrl, chapters } = course;
        // let finalIndex = 1;
        // console.log('course', course);
        let flagForIsPurchased = false;
        let flagForIsPartiallPurchased = false;
        const isContentAvailable = checkIsContentAvailable(chapters);
        IsFullyPurchased && manuplateKeys(chapters);
        if (isContentAvailable && !props.selectedProduct.isFree) {
            if (course.isPartialOrFullPurchased) {
                if (course.purchaseDetails !== null) {
                    flagForIsPurchased = true
                    flagForIsPartiallPurchased = false
                }
                else {
                    flagForIsPurchased = false
                    flagForIsPartiallPurchased = true
                }
            }
            else {
                flagForIsPurchased = false
                flagForIsPartiallPurchased = false
            }
        }
        if (isContentAvailable && props.selectedProduct.isFree) {
            flagForIsPurchased = true
            manuplateKeys(chapters);
        }

        if (!flagForIsPartiallPurchased && !flagForIsPurchased) return null;
        return <div key={`product_subjects_${id}+11`}>
            <Accordion.Toggle key={`product_subjects_${id}`} as={Button} variant="link" eventKey={index + 1} className="width-100" >
                {(flagForIsPartiallPurchased || flagForIsPurchased) && <div className={condition ? "card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper"}>
                    <div className="card-box-inner-wrapper " style={{ color: 'white' }}>
                        <div className="dark-card">
                            <div className="exapand-card-row">
                                <div className="row" style={{ alignItems: 'center' }}>
                                    <div className="col-sm-1">
                                        <div className="exapand-card-col exapand-card-col-id" style={{ textAlign: 'left' }}>
                                            <div className="exapnd-card-box">
                                                <div className="id-box">
                                                    {/* <span className="common-text-exapand-id">{index + 1}</span> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="exapand-card-col exapand-card-col-id" style={{ textAlign: 'left' }}>
                                            <div className="exapnd-card-box">
                                                <div className="profile-image">
                                                    <img className="img-xs" src={imageUrl ? imageUrl : assets.images.instituteDefaultImage} alt="Profile" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="exapand-card-col">
                                            <div className="exapnd-card-box">
                                                <div className="id-box align-left" style={{ textAlign: 'left' }}>
                                                    <span className="common-text-exapand align-left" title={name}>{name ? name : 'Product name not available'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
                <div className={condition ? "card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper"}>
                    <div className="card-box-inner-wrapper col-md-12" style={{ color: 'white', paddingLeft: 50, paddingRight: 50 }}>
                        {chapters.map((e, ei) => {
                            return (
                                (e.isPartialOrFullPurchased && e.purchaseDetails) && e.content.length > 0 && <div className="dark-card" onClick={() => {
                                    SelectedChapterVideoAction.setSelectedChapterVideo(e);
                                    e.content.length > 0 && history.push(
                                        {
                                            pathname: UrlConfig.routeUrls.VideoPlyerList,
                                        }
                                    );
                                }}>
                                    <div className="exapand-card-row">
                                        {/* <div className="exapand-card-col exapand-card-col-id col-md-1">
                                            <div className="exapnd-card-box">
                                                <div className="id-box">
                                                    <span className="common-text-exapand-id">{ei + 1}</span>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="row" style={{ alignItems: 'center' }}>
                                            {/* <div className="col-sm-2">
                                                <div className="exapand-card-col exapand-card-col-id">
                                                    <div className="exapnd-card-box">
                                                        <div className="profile-image">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="col-sm-10">
                                                <div className="exapand-card-col">
                                                    <div className="exapnd-card-box">
                                                        <div className="id-box align-left">
                                                            <span className="common-text-exapand align-left" style={{ marginLeft: 20, marginRight: 20 }} title={name}>{name ? e.name : 'Product name not available'}</span>
                                                            <span style={{ float: "right" }}>({e.content.length})</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Accordion.Collapse>
        </div>
    }
    /****************************************** subjectLooping Function End Here********************************************************************/
    /****************************************** Breadcrump Function Start Here********************************************************************/
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
    /****************************************** Breadcrump Function End Here********************************************************************/
    return (
        <div>
            <div className="common-dark-box">
                {header()}
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                <Accordion defaultActiveKey="0">
                    {
                        subjectListdata.length > 0 && subjectListdata.map((course, index) => {
                            return subjectListLooping(course, index)
                        })
                    }
                </Accordion>
            </div>
        </div >
    )
}

const mapPropsToState = (state) => {
    return {
        productList: state.productList,
        selectedProduct: state.selectedProduct,
        pageHistory: state.pageHistory
    }
}
export default connect(mapPropsToState)(PurchasesProductDetails);

