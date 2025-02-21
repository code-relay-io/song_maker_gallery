import React, { Component } from "react";
import { connect } from "react-redux";

import Loading from "Common/loading";
import GalleryBody from "./gal_body";

import { getGallery } from "Actions/gallery";
import { windowLocation } from "../../util/window";

class Gallery extends Component {
  state = {
    slug: windowLocation("pathname").split("/")[2] || "",
    gallery: null,
  };

  componentDidMount() {
    this.props.getGallery(this.state.slug);
  }
  componentDidUpdate() {
    document.title = this.props?.gallery?.title || document.title;
  }

  render() {
    if (
      // no gallery has been loaded yet
      this.props.status === undefined ||
      // the gallery in the redux state is not the gallery currently being
      // navigated to
      (this.props.gallery && this.props.gallery.slug !== this.state.slug)
    ) {
      return <Loading />;
    } else if (this.state.slug === "") {
      return (
        <div>
          <h1>Invalid Gallery URL!</h1>
        </div>
      );
    } else {
      if (this.props.status != 200) {
        return (
          <div>
            <h1>Gallery Does Not Exist</h1>
            <h2>
              There is no gallery named {this.state.slug.replace("-", " ")}
            </h2>
          </div>
        );
      } else {
        return (
          <div data-testid="mounted gallery body">
            <GalleryBody
              title={this.props.gallery.title}
              description={this.props.gallery.description}
              data={this.props.gallery.songData}
              button={this.state.button}
            />
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    gallery: state.gallery.gallery,
    status: state.gallery.status,
  };
}

export default connect(mapStateToProps, { getGallery })(Gallery);
