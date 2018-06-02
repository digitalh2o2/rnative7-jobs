import axios from "axios";
//import reverseGeocode from "latlng-to-zip";
import qs from "qs";

import { FETCH_JOBS, LIKE_JOB, CLEAR_LIKED_JOBS } from "./types";

const JOB_ROOT_URL = "http://api.indeed.com/ads/apisearch?";
const JOB_QUERY_PARAMS = {
  publisher: "9723155516428820",
  format: "json",
  v: "2",
  latlong: 1,
  radius: 10,
  q: "javascript"
};

const GOOGLE_API_KEY = "AIzaSyCLwwJL71c06R1OZE11ZtRe17sceWvmYEw";
const GEOCODE_ROOT_URL = `https://maps.googleapis.com/maps/api/geocode/json?`;

const buildGeocodeUrl = ({ longitude, latitude }) => {
  const query = qs.stringify({
    key: GOOGLE_API_KEY,
    latlng: `${latitude},${longitude}`
  });
  return `${GEOCODE_ROOT_URL}${query}`;
};

const reverseGeocode = async region => {
  const url = buildGeocodeUrl(region);
  let { data } = await axios.get(url);

  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const { results } = data;

  if (results.length === 0) {
    throw new Error("No Results");
  }

  const postCode = results[0].address_components.find(
    component => component.types[0] === "postal_code"
  );

  if (!postCode) {
    throw new Error("No Postcode");
  }

  return postCode.long_name || postCode.short_name;
};

const buildJobsUrl = zip => {
  const query = qs.stringify({ ...JOB_QUERY_PARAMS, l: zip });
  return `${JOB_ROOT_URL}${query}`;
};

export const fetchJobs = (region, callback) => async dispatch => {
  try {
    let zip = await reverseGeocode(region);
    const url = buildJobsUrl(zip);
    let { data } = await axios.get(url);
    dispatch({
      type: FETCH_JOBS,
      payload: data
    });
    callback();
  } catch (e) {
    console.error(e);
  }
};

export const likeJob = job => {
  return {
    type: LIKE_JOB,
    payload: job
  };
};

export const clearLikedJobs = () => {
  return {
    type: CLEAR_LIKED_JOBS
  };
};
