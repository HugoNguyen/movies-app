const ClipPage = ({ params }: {
    params: {
        id: string
    }
}) => {
    return <>
    <video id="videoPlayer" width="70%" controls autoPlay muted={false}>
      <source src={`/api/clip/${params.id}`} type="video/mp4" />
    </video>
    </>
}

export default ClipPage;