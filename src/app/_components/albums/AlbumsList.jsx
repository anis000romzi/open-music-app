import AlbumItem from './AlbumItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from '../../_styles/style.module.css';

// Import Swiper styles
import 'swiper/css';

function AlbumsList({ albums }) {
  return (
    <div className={styles.albums_list}>
      <Swiper
        style={{ zIndex: 0 }}
        spaceBetween={10}
        slidesPerView={2}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {albums &&
          albums.map((album) => (
            <SwiperSlide key={album.id}>
              <AlbumItem {...album} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default AlbumsList;
