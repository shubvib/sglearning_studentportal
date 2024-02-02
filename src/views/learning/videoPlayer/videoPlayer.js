import React, { useState, useEffect } from "react";
import {
  Tooltip,
  OverlayTrigger,
  Form,
  Accordion,
  Spinner,
  Button,
} from "react-bootstrap";
import { FaBook, FaRegPlayCircle } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { BsCheckCircle, BsCircle, BsDashCircle } from "react-icons/bs";
import { BiLeftArrowCircle } from "react-icons/bi";
import moment from "moment";
import { Api, CommonApiCall, Network } from "../../../services";
import { UrlConfig } from "../../../config";
import assets from "../../../assets";
import { connect } from "react-redux";
import {
  ProductListAction,
  SelectedProductAction,
} from "../../../reduxManager";
import EnumConfig from "../../../config/EnumConfig";
import PagesHeader from "../../../components/shared/Pageheader";
import { GoPrimitiveDot } from "react-icons/go";
import ReactPlayer from "react-player";
import Axios from "axios";
import { toast } from "react-toastify";
import CommonFunctions from "../../../utils/CommonFunctions";
import { useHistory } from "react-router-dom";
const VideoPlyerList = (props) => {
  const history = useHistory();
  const [playingVideo, setPlayingVideo] = useState(null);
  const [playList, setPlayList] = useState(null);
  const [nameOfPlayingVideo, setNameOfPlayingVideo] = useState(null);
  useEffect(() => {
    console.log("selectedChapterVideos", props.selectedChapterVideos);
    setVideoID(
      props.selectedChapterVideos &&
        props.selectedChapterVideos.content &&
        props.selectedChapterVideos.content[0].videoUrl1
    );
    setPlayList(props.selectedChapterVideos.content);
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://player.vimeo.com/video/${props.selectedChapterVideos.content[0].videoUrl1}/config`
    )
      .then((response) => {
        console.log("response.video", response.video);
        setNameOfPlayingVideo(props.selectedChapterVideos.content[0].name);
        setPlayingVideo(response.video);
      })
      .catch((error) => {
        console.log("error", error);
        if (navigator.onLine) {
          console.log("isonline");
        } else {
          console.log("isoffline");
        }
      });
  }, [props.selectedChapterVideos]);

  useEffect(() => {
    console.log("playingVideo", playingVideo);
  }, [playingVideo]);

  useEffect(() => {
    console.log("playList", playList);
  }, [playList]);

  const [videoId, setVideoID] = useState([]);
  const playSelectedVideo = (videoUrl1, name) => {
    setVideoID(videoUrl1);
    setNameOfPlayingVideo(name);
    return;
    console.log("videoUrl1", videoUrl1);
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://player.vimeo.com/video/${videoUrl1}/config`
    )
      .then((response) => {
        if (response) {
          setNameOfPlayingVideo(name);
          setPlayingVideo(response.video);
        }
        // console.log('response', response);
      })
      .catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        toast.error(errorMessage);
        console.log("error", error);
      });
  };
  return (
    <div>
      <PagesHeader
        headerText={"Video Player"}
        customElementsComponent={() => {
          return (
            <>
              <button
                className="go-back-button"
                style={{ background: "transparent", borderStyle: "unset" }}
              >
                <span
                  style={{ color: "#0080ed" }}
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  <BiLeftArrowCircle
                    size={20}
                    style={{ marginRight: "5px" }}
                    color={"#0080ed"}
                  />
                  Go Back
                </span>
              </button>
            </>
          );
        }}
      />
      <div className="common-dark-box">
        <div className="tab-content-box">
          <div className="row">
            <div className="col-sm-12">
              <div className="videoBox">
                <div className="video-gallery full-watch-video">
                  {playingVideo ? (
                    <ReactPlayer
                      style={{ backgroundColor: "black" }}
                      // light={playingVideo && playingVideo.thumbs[640]}
                      controls={true}
                      progressInterval={500}
                      playing={false}
                      onReady={true}
                      url={"https://vimeo.com/" + videoId}
                      width="100%"
                      height="450px"
                    />
                  ) : (
                    <ReactPlayer
                      style={{ backgroundColor: "black" }}
                      light={playingVideo && playingVideo.thumbs[640]}
                      controls={true}
                      progressInterval={500}
                      playing={true}
                      onReady={true}
                      url={"https://vimeo.com/" + videoId}
                      width="100%"
                      height="450px"
                    />
                  )}
                  {playingVideo && (
                    <span className="video-duration">{`${Math.trunc(
                      playingVideo.duration / 60
                    )}:${playingVideo.duration % 60}`}</span>
                  )}
                </div>
                <div className="video-gallery-info full-gallery-info">
                  {nameOfPlayingVideo && <p>{nameOfPlayingVideo}</p>}
                </div>

                {props.selectedChapterVideos &&
                !props.selectedChapterVideos.isFromPurchaseProducts ? (
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      height: "110px",
                      overflowY: "hidden",
                    }}
                  >
                    {playList &&
                      playList.map((video, videoIndex) => {
                        console.log("video", video);
                        console.log("playList", playList);
                        const { videoUrl1, name, id } = video;

                        return (
                          <div
                            key={`video_list_${id}`}
                            className="video-thumbline-main-bx"
                            onClick={() => {
                              playSelectedVideo(videoUrl1, name);
                            }}
                          >
                            <div className="video-thumbline-bx">
                              <span>
                                <FaRegPlayCircle />
                              </span>
                            </div>
                            <div className="video-thumbline-nm-bx" title={name}>
                              <span>{name}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      height: "110px",
                      overflowY: "hidden",
                    }}
                  >
                    {playList &&
                      playList.map((video, videoIndex) => {
                        console.log("isFromPurchaseProductsVideo", video);
                        console.log("playList", playList);
                        const { videoUrl1, name, id, isFree } = video;
                        return (
                          <div
                            key={`video_list_${id}`}
                            className="video-thumbline-main-bx"
                            onClick={() => {
                              isFree === false
                                ? toast.success("Selected topic need to buy..!")
                                : playSelectedVideo(videoUrl1, name);
                            }}
                          >
                            <div className="video-thumbline-bx">
                              {isFree && <span className="tag-name">Free</span>}
                              <span>
                                <FaRegPlayCircle />
                              </span>
                            </div>
                            <div className="video-thumbline-nm-bx" title={name}>
                              <span>{name}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapPropsToState = (state) => {
  return {
    productList: state.productList,
    selectedProduct: state.selectedProduct,
    selectedChapterVideos: state.selectedChapterVideos,
  };
};
export default connect(mapPropsToState)(VideoPlyerList);

// Root reducer
