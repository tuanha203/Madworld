
import ModalFilterMobile from 'components/common/modal-filter-mobile';
import SelectCheckOne from 'components/common/select-type/SelectCheckOne';
import { options } from 'components/templates/assets/charts/price-history';
import * as React from 'react';
import _ from 'lodash';

interface ModalFilterArtistInsight {
    open: boolean;
    setOpen: any;
    filter: any;
}



const ModalFilterArtistInsight = ({ open, setOpen, filter }: ModalFilterArtistInsight) => {
    const { collectionSelected, setCollectionSelected, listCollections, itemFilterSelected, setItemFilterSelected, timeSelected, setTimeSelected, listItemsFilter, defaultCollection } = filter;
    const [collectionSelectedSelf, setCollectionSelectedSelf] = React.useState(collectionSelected);
    const [itemFilterSelectedSelf, setItemFilterSelectedSelf] = React.useState(itemFilterSelected);
    const [timeSelectedSelf, setTimeSelectedSelf] = React.useState(timeSelected);


    React.useEffect(() => {
        if (document) {
            if (open) {
                document.querySelector("body")!.style.overflow = "hidden"
                return () => { document.querySelector("body")!.style.overflow = "" }
            } else {
                document.querySelector("body")!.style.overflow = ""
            }
        }
    }, [open])

    const handleClose = () => {
        setOpen(false)
    }

    const activeReset = React.useCallback(() => {
        if (_.isEqual(collectionSelectedSelf, defaultCollection) && _.isEqual(itemFilterSelectedSelf, listItemsFilter[0]) && _.isEqual(timeSelectedSelf, options[0])) return false;
        return true;
    }, [collectionSelectedSelf, itemFilterSelectedSelf, timeSelectedSelf]);


    React.useEffect(() => {
        setCollectionSelectedSelf(collectionSelected)
        setTimeSelectedSelf(timeSelected)
        setItemFilterSelectedSelf(itemFilterSelected)
    }, [open])

    const handleApply = () => {
        setTimeSelected(timeSelectedSelf)
        setItemFilterSelected(itemFilterSelectedSelf)
        setCollectionSelected(collectionSelectedSelf)

        handleClose()
    }

    const handleReset = () => {
        setCollectionSelectedSelf(defaultCollection)
        setTimeSelectedSelf(options[0])
        setItemFilterSelectedSelf(listItemsFilter[0])
    }



    return (
        <>
            <ModalFilterMobile activeReset={activeReset} handleReset={handleReset} handleApply={handleApply} handleClose={handleClose} open={open} >
                <SelectCheckOne
                    data={listCollections}
                    setValueCheck={(value: any) => {
                        if (_.isEqual(value, defaultCollection)) setItemFilterSelectedSelf(listItemsFilter[0])
                            setCollectionSelectedSelf(value)
                    }}
                    text={"Collection"}
                    valueCheck={collectionSelectedSelf}
                    isLast
                    mobile
                    notNull
                />

                <SelectCheckOne
                    data={listItemsFilter}
                    setValueCheck={setItemFilterSelectedSelf}
                    text={"Item"}
                    valueCheck={itemFilterSelectedSelf}
                    mobile
                    notNull
                    disable={_.isEqual(collectionSelectedSelf, defaultCollection)}
                />

                <SelectCheckOne
                    data={options}
                    setValueCheck={setTimeSelectedSelf}
                    text={"Time"}
                    valueCheck={timeSelectedSelf}
                    mobile
                    notNull
                />



            </ModalFilterMobile>


        </>
    );
};

export default ModalFilterArtistInsight;
