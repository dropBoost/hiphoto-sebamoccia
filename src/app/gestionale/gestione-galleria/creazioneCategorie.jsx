export default function CreazioneCategorie (props) {

    const onDisplay = props.onDisplay

    return (
        <>
        <div className={`${onDisplay === 'on' ? '' : 'hidden'}`}>
        <h1>CREaZIONE CATEGORIE</h1>
        </div>
        </>
    )
}