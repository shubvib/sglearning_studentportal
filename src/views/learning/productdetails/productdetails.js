import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Form, Accordion, Spinner, Button, Toast } from 'react-bootstrap';
import { FaBook } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { BsCheckCircle, BsCircle, BsDashCircle } from "react-icons/bs";
import moment from 'moment';
import { Api, CommonApiCall, Network } from '../../../services';
import { UrlConfig } from '../../../config';
import assets from '../../../assets';
import { connect } from 'react-redux';
import { ProductListAction, SelectedChapterVideoAction, SelectedProductAction } from '../../../reduxManager'
import EnumConfig from '../../../config/EnumConfig';
import StripeModal from './Modal/StripeModal';
import { razorPay } from '../../../components/shared/RazorPayCheckout';
import { toast } from "react-toastify";
import CommonFunctions from '../../../utils/CommonFunctions';
import { useHistory } from "react-router-dom";


const ProductDetails = (props) => {
    const history = useHistory();
    const [showStripeModalModal, setshowStripeModal] = useState(false);
    const handleCloseshowStripeModal = () => setshowStripeModal(false);
    const handleAssignClick = () => {

    }
    const [open, setOpen] = useState(false);
    const [condition, setCondition] = useState(false);
    const [subjectListdata, setsubjectListdata] = useState([]);
    const [selectedPackage, setselectedPackage] = useState();

    const [counter, setCounter] = useState(0);
    const [showLoader, setLoader] = useState(false);
    const [productID, setProductID] = useState('');
    const [FinalPrice, setFInalPrice] = useState(0);
    const [productPrice, setProductPrice] = useState(0);

    const [tempList, setTemplist] = useState({
        isFromPurchaseProducts: true
    });
    const headerRightComponenet = () => {
        return <div className="import-btn-main-box">

        </div>
    }

    useEffect(() => {
        console.log('hello')
    }, []);

    useEffect(() => {
        if (props.selectedProduct) {
            if (props.selectedProduct.productType === EnumConfig.ProductType.videoPackages && props.selectedProduct.coursePackage) {
                console.log('props.selectedProduct', props.selectedProduct);
                setselectedPackage(props.selectedProduct.coursePackage);
                setFInalPrice(props.selectedProduct.coursePackage.price);
                if (props.selectedProduct.coursePackage.price && props.selectedProduct.coursePackage.discountInPercent) {
                    const calcuPrice = calculatePercentage(props.selectedProduct.coursePackage.price, props.selectedProduct.coursePackage.discountInPercent);
                    setProductPrice(calcuPrice);
                } else {
                    setProductPrice(props.selectedProduct.coursePackage.price);
                }


                props.selectedProduct.coursePackage.subjects && setsubjectListdata(props.selectedProduct.coursePackage.subjects)
            }
        }

    }, [props.selectedProduct])
    const [packagesForCheckout, setCheckOut] = useState();
    const [clientKeys, setClientKeys] = useState()

    const successPayment = (response) => {
        // const { description } = response;
        setLoader(true);
        const message = 'The product purchased successfully.'
        toast.success(message);
        setTimeout(function () {
            setLoader(false);
            history.push(UrlConfig.routeUrls.learning);
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
            return;
        }
        const { packageIds } = packagesForCheckout;
        if (packageIds.length > 5) {
            const erroMessage = 'You can not purchase more than 5 chapters or package';
            toast(erroMessage, {
                type: "error",
            });
            return;
        }
        setLoader(true);
        let newPackageData = packagesForCheckout;
        if (FinalPrice === productPrice) {
            const { id } = props.selectedProduct.coursePackage;
            newPackageData = { ...packagesForCheckout, packageIds: [id] };
        } else {
            newPackageData = packagesForCheckout;
        }
        CommonApiCall.getClientSecreteKey(newPackageData).then((response) => {
            const { data, message } = response;
            if (data) {
                const { clientSecret, productId, amount, currency } = data;
                // const amount = calculatePercentage(item.price, item.discountInPercent)
                // const paymentData = { clientSecret, productId: productId, amount };
                // setClientKeys(paymentData)
                // setshowStripeModal(true)
                if (props.userData) {
                    console.log('props.userData', props.userData)
                    const { userData } = props;
                    const { firstName, lastName, userName, email, profileImage } = userData;
                }

                const dic = { successPayment: () => successPayment(), failurePayment: (error = '') => failurePayment(error), itemAmount: amount, itemImage: '', itemName: '', userEmail: '', userContact: "", userName: '', orderId: clientSecret, product_type: EnumConfig.ProductType.videoPackages }
                razorPay(dic);

            } else {
                if (message) {
                    toast(message, {
                        type: "error",
                    });
                }
            }

            console.log('client secrete response....', data)
            setLoader(false);
            // handleShowCardModal();
        }).catch((error) => {
            console.log('error', error);
            setLoader(false);
            const erroMessage = CommonFunctions.apiErrorMessage(error);
            // const data = { description: erroMessage };
            toast(erroMessage, {
                type: "error",
            });
        });
    }

    const getForFreeProduct = (item) => {
        setLoader(true);
        let payload = {
            "productId": item.id,
            "productType": 2
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

                    <div>
                        <h1 className="common-dark-box-title">{name}</h1>
                        <h3 className="common-dark-box-title" >
                            <span style={{ textDecoration: 'line-through', color: 'white' }}>
                                ₹ {price}
                            </span>
                            <span>
                                {"  " + discountInPercent}% OFF

                            </span>
                        </h3>

                        <h3 className="common-dark-box-title" style={{ color: 'white' }}>  ₹ {productPrice} Price</h3>
                    </div>
                    <div style={{ flexDirection: 'row', display: 'flex' }}>
                        <h3 className="common-dark-box-title" style={{ color: 'white', marginRight: 10 }}>Total Amount: &nbsp; ₹ {FinalPrice}</h3>
                        {(selectedPackage && !props.selectedProduct.isFree) &&
                            <button type="submit" className={`${FinalPrice > 0 ? "btn-product-buy" : "btn-product-buy disabled"}`} onClick={() => {
                                paymentIntent();
                                // paymentIntent();
                            }}>{'Buy Now'} </button>}
                        {(selectedPackage && props.selectedProduct.isFree && !props.selectedProduct.isPartialOrFullPurchased) &&
                            <button type="submit" className={`${FinalPrice > 0 ? "btn-product-buy" : "btn-product-buy disabled"}`} onClick={() => {
                                // getForFreeProduct(props.selectedProduct);
                                // paymentIntent();
                            }}>{'Get For Free'} </button>}
                        {(selectedPackage && props.selectedProduct.isFree && props.selectedProduct.isPartialOrFullPurchased) && <button type="submit" class={`${FinalPrice > 0 ? "btn-product-buy" : "btn-product-buy disabled"}`} onClick={() => {
                            history.push({
                                pathname: '/learning'
                            })
                        }} >{'Go To Exam'} </button>}
                    </div>

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
        if (props.selectedProduct && props.selectedProduct.coursePackage && props.selectedProduct.coursePackage.price) {
            let ap = props.selectedProduct.coursePackage.price;
            let di = props.selectedProduct.coursePackage.discountInPercent;
            price = calculatePercentage(ap, di);


        }
        setFInalPrice(0);
        let obj = 0;
        let objID = 0;
        let payload = {
            "productId": props.selectedProduct.id,
            "productType": props.selectedProduct.productType,
            "packageIds": [],
            "paymentGateway": "razorpay",
        }
        // {"productId":"c711ded4-a94d-49af-a93f-11b792d25fbd","productType":2,"packageIds":["f1127067-bb7f-4aef-9d1b-d93f7d16dfbd"],"paymentGateway":"razorpay"}


        subjectListdata.map((sub, index) => {
            if (sub.isSubSelected === 1) {
                objID = objID + 1;
                obj = obj + calculatePercentage(sub.price, sub.discountInPercent);
                setFInalPrice(obj);
                sub.price > 0 && payload.packageIds.push(sub.id)
            } else if (sub.isSubSelected === 2) {
                sub.chapters.map((ch, cIndex) => {
                    if (ch.ischapterSelected === 1) {
                        obj = obj + calculatePercentage(ch.price, ch.discountInPercent);
                        setFInalPrice(obj);
                        ch.price > 0 && payload.packageIds.push(ch.id);
                    }
                })

            } else {

            }
            objID === subjectListdata.length && setFInalPrice(price);
            setCheckOut(payload)
        });
    }, [subjectListdata]);
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
    const getChapterLength = (chapters) => {
        let chapterLength = 0;
        chapters.map((ch) => {
            const { content } = ch;
            if (content && content.length > 0) {
                chapterLength++;
            }
            return true;
        });
        return chapterLength;
    }
    const checkIsContentAvailable = (chapters) => {
        const result = chapters.find(chapter => (chapter.content.length > 0));
        return result;
    }
    const subjectListLooping = (course, index) => {

        const { name, description, price, discountInPercent, imageUrl, chapters, isSubSelected } = course;
        console.log('course', course);
        if (chapters && chapters.length === 0) return null;
        const isContentAvailable = checkIsContentAvailable(chapters);
        return <div>
            <Accordion.Toggle as={Button} variant="link" eventKey={index + 1} className="width-100" onClick={() => {
                subjectCheckBox(course)
            }}>
                {isContentAvailable && <div className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>


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
                                        <div className="exapand-card-col exapand-card-col-id">
                                            <div className="exapnd-card-box">
                                                <div className="profile-image">
                                                    <img className="img-xs" src={imageUrl ? imageUrl : assets.images.instituteDefaultImage} alt="Profile" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="exapand-card-col">
                                            <div className="exapnd-card-box">
                                                <div className="id-box align-left">
                                                    <span className="common-text-exapand align-left" title={name}>{name ? name : 'Product name not available'}</span>
                                                    {(chapters && chapters.length > 0) && <span className="common-text-exapand align-left" title={name} style={{ marginLeft: 10 }} >({getChapterLength(chapters)})</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="exapand-card-col">
                                            <div className="exapnd-card-box">
                                                <div className="id-box align-left" >
                                                    <span className="common-text-exapand align-left" title={price} style={{ textDecoration: 'line-through', color: 'white' }} >₹ {price} ‎‎</span>
                                                    <span className="common-text-exapand align-left" title={price} style={{ color: 'white', marginLeft: 10 }} >₹ {calculatePercentage(price, discountInPercent)} ‎‎</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="exapand-card-col">
                                            <div className="exapnd-card-box">
                                                <div className="id-box align-left">
                                                    <span className="common-text-exapand align-left" title={discountInPercent}>{discountInPercent}% OFF</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="exapand-card-col-ProductList">
                                            <div className="exapnd-card-box">
                                                {/* <input type="checkbox" onChange={()=>{
                                       
                                    }
                                    }  defaultChecked={isSubSelected && isSubSelected===1?true:false} className="user-checkBox" /> */}

                                                <span className="check-box-check" onClick={() => {
                                                    let product = subjectListdata;
                                                    if (course.isSubSelected === 1) {
                                                        product[index].isSubSelected = 0
                                                    } else {
                                                        if (course.isSubSelected === 0) {
                                                            product[index].isSubSelected = 1
                                                        }
                                                    }
                                                    const updateArray = async () => {
                                                        let chapterList = await product[index].chapters.map((ch) => {
                                                            if (course.isSubSelected === 1) {
                                                                ch.ischapterSelected = 1;
                                                                return ch;
                                                            } else if (course.isSubSelected === 0) {
                                                                ch.ischapterSelected = 0;
                                                                return ch;
                                                            } else {
                                                                return ch;
                                                            }

                                                        });
                                                        product[index].chapters = chapterList;
                                                        setsubjectListdata(product);
                                                        return product;
                                                    }
                                                    setsubjectListdata([]);
                                                    updateArray();
                                                }}>

                                                    {
                                                        price > 0 && <CheckBoxUI isSubSelected={course.isSubSelected} />

                                                    }
                                                </span>

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
                <div className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>


                    <div className="card-box-inner-wrapper col-md-12" style={{ color: 'white' }}>
                        {chapters.map((e, ei) => {
                            console.log('e', e);
                            const { content } = e;
                            if (!content || content.length === 0) return null
                            return (
                                <div className="dark-card">
                                    <div className="exapand-card-row" style={{ display: 'flex' }}>
                                        {/* <div className="exapand-card-col exapand-card-col-id col-md-1">
                                            <div className="exapnd-card-box">
                                                <div className="id-box">
                                                    <span className="common-text-exapand-id">{ei + 1}</span>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div style={{ width: '100%', display: 'flex' }} onClick={() => {
                                            e.isFromPurchaseProducts = true;
                                            console.log('Hello', e)
                                            SelectedChapterVideoAction.setSelectedChapterVideo(e);
                                            e.content.length > 0 && history.push(
                                                {
                                                    pathname: UrlConfig.routeUrls.VideoPlyerList,
                                                }
                                            );
                                            // ProductListAction.setProductList(data);
                                        }}>
                                            <div className="exapand-card-col exapand-card-col-id col-md-1">
                                                <div className="exapnd-card-box">
                                                    <div className="profile-image">
                                                        {/* <img className="img-xs" src={imageUrl ? imageUrl : assets.images.instituteDefaultImage} alt="Profile" /> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="exapand-card-col col-md-5 ">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box align-left">
                                                        <span className="common-text-exapand align-left" title={name}>{name ? e.name : 'Product name not available'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="exapand-card-col col-md-2 ">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box align-left">
                                                        {/* <span className="common-text-exapand align-left" title={e.price}>{e.price} ‎₹‎</span> */}
                                                        {e.price ?
                                                            <>
                                                                <span className="common-text-exapand align-left" title={price} style={{ textDecoration: 'line-through', color: 'white' }} >₹ {e.price} ‎‎</span>
                                                                <span className="common-text-exapand align-left" title={price} style={{ color: 'white', marginLeft: 10 }} >₹ {calculatePercentage(e.price, e.discountInPercent)} ‎‎</span>
                                                            </> :
                                                            <span className="common-text-exapand align-left" title={price} style={{ color: 'white', fontSize: 13 }} >Not for individual sale ‎‎</span>
                                                        }

                                                    </div>

                                                </div>

                                            </div>
                                            <div className="exapand-card-col col-md-2 ">
                                                <div className="exapnd-card-box">
                                                    <div className="id-box align-left">
                                                        {(e.price > 0 && e.discountInPercent > 0) && <span className="common-text-exapand align-left" title={e.discountInPercent}>{e.discountInPercent}% OFF</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="exapand-card-col-ProductList col-md-2 ">
                                            <div className="exapnd-card-box">
                                                {(e.price > 0 && e.discountInPercent > 0) && <input type="checkbox"
                                                    onChange={() => {
                                                        let product = subjectListdata;
                                                        product[index].isSubSelected = 2;
                                                        e.ischapterSelected === 1 ? e.ischapterSelected = 0 : e.ischapterSelected = 1;
                                                        const updateArray = async () => {
                                                            let checkAllSelected = true;
                                                            let chapterList = await product[index].chapters.map((ch) => {
                                                                if (ch.ischapterSelected === 0 && (ch.content && ch.content.length > 0) && ch.price > 0) {
                                                                    checkAllSelected = false;
                                                                }
                                                                return ch;
                                                            });
                                                            checkAllSelected ? product[index].isSubSelected = 1 : product[index].isSubSelected = 2;
                                                            product[index].chapters = chapterList;
                                                            setsubjectListdata(product);
                                                            return product;
                                                        }
                                                        setsubjectListdata([]);
                                                        updateArray();
                                                    }}
                                                    defaultChecked={(e.isPartialOrFullPurchased === false && e.ischapterSelected) === 1 ? true : false} className={e.isPartialOrFullPurchased === false ? "user-checkBox" : "user-checkBox disabled"} />}
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
                <Accordion defaultActiveKey="0">
                    {
                        subjectListdata.length > 0 && subjectListdata.map((course, index) => {
                            { console.log('coursecoursecourse', course) }
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
        userData: state.userData,
    }
}
export default connect(mapPropsToState)(ProductDetails);



