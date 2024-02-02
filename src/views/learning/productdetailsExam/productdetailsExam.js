import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Form, Accordion, Spinner, Button } from 'react-bootstrap';
import { FaBook } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { BsCheckCircle, BsCircle, BsDashCircle } from "react-icons/bs";
import moment from 'moment';
import { Api, CommonApiCall, Network } from '../../../services';
import { UrlConfig } from '../../../config';
import assets from '../../../assets';
import { connect } from 'react-redux';
import { ProductListAction, SelectedProductAction } from '../../../reduxManager'
import EnumConfig from '../../../config/EnumConfig';
import StripeModal from '../productdetails/Modal/StripeModal';
import { razorPay } from '../../../components/shared/RazorPayCheckout';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import CommonFunctions from '../../../utils/CommonFunctions';
const ProductDetailsExam = (props) => {

    const handleAssignClick = () => {

    }
    const [packagesForCheckout, setCheckOut] = useState();
    const [showStripeModalModal, setshowStripeModal] = useState(false);
    const [clientKeys, setClientKeys] = useState()
    const handleCloseshowStripeModal = () => setshowStripeModal(false);
    const [open, setOpen] = useState(false);
    const [condition, setCondition] = useState(false);
    const [examPackageList, setExamPackageList] = useState([]);
    const [selectedPackage, setselectedPackage] = useState();

    const [counter, setCounter] = useState(0);
    const [showLoader, setLoader] = useState(false);
    const [productID, setProductID] = useState('');
    const [FinalPrice, setFInalPrice] = useState(0);
    const history = useHistory();

    const headerRightComponenet = () => {
        return <div className="import-btn-main-box">

        </div>
    }

    useEffect(() => {
        if (props.selectedProduct) {
            if (props.selectedProduct.productType === EnumConfig.ProductType.examPackages && props.selectedProduct.examPackage) {
                setselectedPackage(props.selectedProduct.examPackage);
                setFInalPrice(props.selectedProduct.examPackage.price);
                // let payload = {
                //     "productId": props.selectedProduct.id,
                //     "productType": props.selectedProduct.productType,
                //     "packageIds": [props.selectedProduct.id]
                // }
                let payload = {
                    "productId": props.selectedProduct.id,
                    "productType": props.selectedProduct.productType,
                    "paymentGateway": "razorpay"
                }
                setCheckOut(payload)
                props.selectedProduct.examPackage.exams && setExamPackageList(props.selectedProduct.examPackage.exams)
            }
        }

    }, [props.selectedProduct])
    const successPayment = (response) => {
        // const { description } = response;
        setLoader(true);
        const message = 'The product purchased successfully.'
        toast.success(message);
        setTimeout(function () {
            setLoader(false);
            history.push(UrlConfig.routeUrls.exam);
        }, 3000);
    }
    const failurePayment = (response) => {
        const { error } = response;
        const { description } = error;
        toast(description, {
            type: "error",
        });
    }
    const paymentIntent = () => {
        if (!packagesForCheckout) {
            return
        }
        setLoader(true);
        CommonApiCall.getClientSecreteKey(packagesForCheckout).then((response) => {
            const { data } = response;
            if (data) {
                const { clientSecret, productId } = data;
                console.log('dataaaaaaaaaaa', data)
                const amount = 200;
                // const amount = calculatePercentage(item.price, item.discountInPercent)
                // const paymentData = { clientSecret, productId: productId, amount };
                // setClientKeys(paymentData)
                // setshowStripeModal(true)
                const dic = { successPayment: () => successPayment(), failurePayment: (error = '') => failurePayment(error), itemAmount: amount, itemImage: '', itemName: '', userEmail: '', userContact: "", userName: '', orderId: clientSecret, product_type: EnumConfig.ProductType.videoPackages }
                razorPay(dic);

            }
            console.log('client secrete response....', data)
            setLoader(false);
            // handleShowCardModal();
        }).catch((error) => {
            setLoader(false);
            // const erroMessage = CommonFunctions.apiErrorMessage(error);
            // const data = { description: erroMessage };
            // failuerPay(data);
        });
    }
    const getForFreeProduct = (item) => {
        setLoader(true);
        let payload = {
            "productId": item.id,
            "productType": 1
        };
        Api.postApi(UrlConfig.apiUrls.getForFreeExam + item.id + '/purchaseForFree', payload)
            .then((response) => {
                if (response) {
                    console.log("responseeeeee", response);
                    toast.success('exam assigned for you please goto exam page.')
                    item.isPartialOrFullPurchased = true;
                    setTimeout(function () { setLoader(false); }, 2000);
                }
                else {
                    toast.success('exam assigned for you please goto exam page.')
                    item.isPartialOrFullPurchased = true;
                    setTimeout(function () { setLoader(false); }, 2000);
                }
            })
            .catch((err) => {
                toast.success('exam assigned for you please goto exam page.')
                item.isPartialOrFullPurchased = true;
                setTimeout(function () { setLoader(false); }, 2000);
            })

    }


    const header = () => {
        if (selectedPackage) {

            const { name, price, discountInPercent, purchaseDetails } = selectedPackage;
            return (
                <div className="common-title-wrapper-dark">
                    {price ? <div>
                        <h1 className="common-dark-box-title">{name ? name : 'Exam Package'}</h1>
                        {price && <h3 className="common-dark-box-title" >
                            <span style={{ textDecoration: 'line-through', color: 'white' }}>
                                ₹ {price}
                            </span>
                            {discountInPercent && discountInPercent != 0 && <span>
                                {"  " + discountInPercent}% OFF

                            </span>
                            }
                        </h3>
                        }
                        {discountInPercent && <h3 className="common-dark-box-title" style={{ color: 'white' }}>  ₹ {calculatePercentage(price, discountInPercent)} Price</h3>}
                    </div> :
                        <div />
                    }
                    {(selectedPackage && !props.selectedProduct.isFree) && <button type="submit" class="btn-product-buy" onClick={() => {
                        paymentIntent();
                    }} >{'Buy Now'} </button>}
                    {(selectedPackage && props.selectedProduct.isFree && !props.selectedProduct.isPartialOrFullPurchased) && <button class="btn-product-buy" onClick={() => {
                        getForFreeProduct(props.selectedProduct);
                    }} >{'Get For Free'} </button>}
                    {(selectedPackage && props.selectedProduct.isFree && props.selectedProduct.isPartialOrFullPurchased) && <button type="submit" class="btn-product-buy" onClick={() => {
                        history.push({
                            pathname: '/examList'
                        })
                    }} >{'Go To Exam'} </button>}


                </div>
            )
        }
    }
    const subjectCheckBox = (course) => {


    }



    const CheckBoxUI = (props) => {
        const {
            isSubSelected
        } = props;
        let i = isSubSelected;
        if (i === 1) {
            return <BsCheckCircle />
        } else if (i === 2) {
            return <BsDashCircle />
        } else {
            return <BsCircle />
        }

    }
    useEffect(() => {
        let price = 0;
        if (props.selectedProduct && props.selectedProduct.examPackage && props.selectedProduct.examPackage.price) {
            let ap = props.selectedProduct.examPackage.price;
            let di = props.selectedProduct.examPackage.discountInPercent;
            price = calculatePercentage(ap, di);
            setFInalPrice(price)

        }
        setFInalPrice(0);
        let obj = 0;
        let objID = 0;
        examPackageList.map((sub, index) => {
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
        });
    }, [examPackageList]);
    const calculatePercentage = (MRPPrice, discountPrice) => {
        let price = (MRPPrice / 100) * discountPrice
        price = MRPPrice - price
        return price;
    }

    const asynArrayAdd = async (product, index, course) => {
        product[index].chapters.forEach((ch) => {
            if (course.isSubSelected === 1) {
                ch.ischapterSelected = 1;
            } else if (course.isSubSelected === 0) {
                ch.ischapterSelected = 0;

            } else {

            }
        });
        return product;
    }
    const subjectListLooping = (course, index) => {

        const { name, description, price, discountInPercent, imageUrl, chapters, isSubSelected } = course;

        return <div className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>


            <div className="card-box-inner-wrapper " style={{ color: 'white' }}>
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
                            <div className="col-sm-2">
                                <div className="exapand-card-col exapand-card-col-id ">
                                    <div className="exapnd-card-box">
                                        <div class="profile-image">
                                            <img className="img-xs" src={imageUrl ? imageUrl : assets.images.instituteDefaultImage} alt="Profile" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-9">
                                <div className="exapand-card-col">
                                    <div className="exapnd-card-box">
                                        <div className="id-box align-left">
                                            <span className="common-text-exapand align-left" title={name}>{name ? name : 'Product name not available'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    }
    return (

        <div>

            <div className="common-dark-box">
                {/* <StripeModal
                    clientKeys={clientKeys}
                    showStripeModalModal={showStripeModalModal}
                    handleCloseshowStripeModal={handleCloseshowStripeModal}
                    productToPurchase={props.selectedProduct}
                /> */}
                {header()}
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                {/* {
                    examPackageList.length != 0 ? examPackageList.map((course, index) => {
                        const { name, description, price, discountInPercent, imageUrl } = course;

                        return <div className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>


                            <div className="card-box-inner-wrapper col-md-12" style={{ color: 'white' }}>
                                <div className="dark-card">
                                    <div className="exapand-card-row">
                                        <div className="exapand-card-col exapand-card-col-id col-md-1">
                                            <div className="exapnd-card-box">
                                                <div className="id-box">
                                                    <span className="common-text-exapand-id">{index + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="exapand-card-col exapand-card-col-id col-md-1">
                                            <div className="exapnd-card-box">
                                                <div class="profile-image">
                                                    <img className="img-xs" src={imageUrl ? imageUrl : assets.images.instituteDefaultImage} alt="Profile" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="exapand-card-col col-md-9 ">
                                            <div className="exapnd-card-box">
                                                <div className="id-box align-left">
                                                    <span className="common-text-exapand align-left" title={name}>{name ? name : 'Product name not available'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="exapand-card-col-ProductList col-md-2 ">
                                            <div className="exapnd-card-box">
                                                <input type="checkbox" className="user-checkBox" />
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
                } */}
                <Accordion defaultActiveKey="0">
                    {
                        examPackageList.length > 0 && examPackageList.map((course, index) => {
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
        selectedProduct: state.selectedProduct
    }
}
export default connect(mapPropsToState)(ProductDetailsExam);

// Root reducer





